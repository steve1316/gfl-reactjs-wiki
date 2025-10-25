import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

// MaterialUI imports
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

// MaterialUI icon imports
import CloseIcon from "@mui/icons-material/Close";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import ArtZoomControls from "../../components/ArtZoomControls";
import FilterChip from "../../components/FilterChip";
import LoadError from "../../components/LoadError";
import { useCloseOnEscape } from "../../hooks/useArtViewer";
import { useZoomPan } from "../../hooks/useZoomPan";
import { skinLive2dModelUrl } from "../../lib/assets";
import { loadDoll } from "../../lib/data";
import { motionTabs, resolveSkinLive2dVariant, useSkinLive2dForms, useSkinLive2dMotions } from "../../lib/useLive2dMotions";
import { useLive2dStage } from "../../lib/useLive2dStage";
import NotFound404 from "../../not_found_404";
import type { TDoll } from "../../types/tdoll";

/** One form's skins from `useSkinLive2dForms`, mapping each skin key to the variant names it has. */
type SkinLive2dSkins = Record<string, string[]>;

/** A doll's published Live2D form/skin/variant combinations, from `useSkinLive2dForms`. */
type SkinLive2dForms = Record<string, SkinLive2dSkins>;

/** A resolved form, skin and variant selection. Always names a combination `forms` actually reports. */
interface Live2dSelection {
	/** `base` or `mod`. */
	form: string;
	/** `base` for the form's own art, or a skin id as a string. */
	skinKey: string;
	/** `normal` or `damaged`. */
	variant: string;
}

const styles = {
	root: { position: "fixed", inset: 0, bgcolor: "common.black", zIndex: (theme: Theme) => theme.zIndex.modal, display: "flex", flexDirection: "column" },
	header: { display: "flex", alignItems: "center", gap: 1, p: 1, color: "common.white" },
	iconButton: { color: "inherit" },
	title: { flexGrow: 1 },
	centred: { flexGrow: 1, display: "grid", placeItems: "center", p: 2 },
	placeholderStage: { position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2 },
	placeholderBox: { width: 256, maxWidth: "60vw" },
	placeholder: { aspectRatio: "1 / 1" },
	stage: { flexGrow: 1, position: "relative", overflow: "hidden", cursor: "pointer" },
	canvas: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" },
	statusOverlay: { position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2 },
	footer: { display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 1 },
	pickerRow: { display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", "& .MuiToggleButton-root": { color: "common.white" } },
	tiles: { display: "flex", flexWrap: "wrap", justifyContent: "center", listStyle: "none", p: 0, m: 0, gap: 0.5 },
	dialogueLine: { mt: 0.5, fontStyle: "italic", color: "common.white", opacity: 0.85, textAlign: "center", px: 2 }
} satisfies Record<string, SxProps<Theme>>;

/**
 * Sort key for a skin key: the form's own art first, then skins in ascending id order.
 *
 * @param skinKey `base` or a skin id as a string.
 * @returns A number to sort by, ascending. Anything that does not parse as a number sorts last.
 */
function skinSortKey(skinKey: string): number {
	if (skinKey === "base") {
		return -1;
	}
	const id = Number(skinKey);
	return Number.isNaN(id) ? Infinity : id;
}

/**
 * A form's skin keys in picker order: `base` first, then skins by ascending id.
 *
 * @param skins The form's skins, keyed by skin key.
 * @returns The skin keys in picker order.
 */
function sortedSkinKeys(skins: SkinLive2dSkins): string[] {
	return Object.keys(skins).sort((a, b) => skinSortKey(a) - skinSortKey(b));
}

/**
 * Resolve a form, skin and variant selection to a combination `forms` actually reports, falling back to the first form, its first skin,
 * then `normal` when a requested part is missing or names a combination that does not exist.
 *
 * @param forms The doll's published combinations from `useSkinLive2dForms`.
 * @param formParam The requested form, or null.
 * @param skinParam The requested skin key, or null.
 * @param variantParam The requested variant, or null.
 * @returns The resolved selection.
 */
function resolveSelection(forms: SkinLive2dForms, formParam: string | null, skinParam: string | null, variantParam: string | null): Live2dSelection {
	const formKeys = Object.keys(forms);
	const form = formParam !== null && forms[formParam] !== undefined ? formParam : (formKeys[0] ?? "base");
	const skins = forms[form] ?? {};
	const skinKeys = sortedSkinKeys(skins);
	const skinKey = skinParam !== null && skins[skinParam] !== undefined ? skinParam : (skinKeys[0] ?? "base");
	const variants = skins[skinKey] ?? [];
	const variant = resolveSkinLive2dVariant(variants, variantParam);
	return { form, skinKey, variant };
}

/**
 * The label for a form key.
 *
 * @param form `base` or `mod`.
 * @returns "Base" or "Mod".
 */
function formLabel(form: string): string {
	return form === "mod" ? "Mod" : "Base";
}

/**
 * The label for a skin key, using the doll's own skin name when it is known.
 *
 * @param skinKey `base` for the form's own art, or a skin id as a string.
 * @param doll The doll the skin belongs to, or undefined before it loads.
 * @returns "Base", the skin's name, or "Skin <id>" when the doll has no name on record for it.
 */
function skinLabel(skinKey: string, doll: TDoll | undefined): string {
	if (skinKey === "base") {
		return "Base";
	}
	const index = doll?.skins?.skin_ids.findIndex((skinId) => skinId !== null && String(skinId) === skinKey) ?? -1;
	return (index >= 0 ? doll?.skins?.skin_names[index] : undefined) ?? `Skin ${skinKey}`;
}

/**
 * Full-screen Live2D viewer for a T-Doll skin's model, with zoom, pan, motion cycling and a form/skin/variant picker.
 *
 * A route rather than an overlay, like the fairy Live2D viewer, so Back closes it and the combination on screen can be linked to.
 *
 * @returns The viewer, a retry notice, or the 404 page for an unknown id.
 */
export default function TDollLive2d() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();

	// Captured at open, since the picker's replace gives the location a new key and would hide a pasted link's `default` key.
	const openedKey = useRef(location.key);

	// Undefined while loading and null when no doll has this id, matching tdoll_art.tsx's own load state.
	const [doll, setDoll] = useState<TDoll | null | undefined>(undefined);
	const [loadFailed, setLoadFailed] = useState(false);
	const [loadAttempt, setLoadAttempt] = useState(0);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 6, doubleScale: 2.5, doubleClickZoom: false });

	const dollId = doll ? doll.normal.id : undefined;
	const forms = useSkinLive2dForms(dollId);
	// Null while `forms` is still loading, so the combination is not resolved to a stray fallback before the real data arrives.
	const selection = forms ? resolveSelection(forms, searchParams.get("form"), searchParams.get("skin"), searchParams.get("variant")) : undefined;

	const formKeys = forms ? Object.keys(forms) : [];
	// True once the doll's forms have loaded and at least one combination exists. False both while loading and when nothing was published.
	const hasModel = formKeys.length > 0;
	const skinKeys = forms && selection ? sortedSkinKeys(forms[selection.form] ?? {}) : [];
	const variants = forms && selection ? (forms[selection.form]?.[selection.skinKey] ?? []) : [];

	const modelUrl = dollId !== undefined && selection ? skinLive2dModelUrl(dollId, selection.form, selection.skinKey, selection.variant) : undefined;

	const motionsId = dollId !== undefined && selection ? dollId : undefined;
	const motions = useSkinLive2dMotions(motionsId, selection?.form ?? "base", selection?.skinKey ?? "base", selection?.variant ?? "normal");
	const tabs = useMemo(() => motionTabs(motions ?? []), [motions]);

	const live2dStage = useLive2dStage(canvasRef, modelUrl, tabs, zoom.containerRef);

	// The motion actually driving the stage right now, found by its model3Group so its dialogue line can be shown.
	// Read with ?? rather than a strict null check, since a motion's line is optional and can be omitted entirely.
	const activeMotion = motions?.find((entry) => entry.model3Group === live2dStage.motion);
	const dialogueLine = activeMotion?.line ?? null;

	useEffect(() => {
		let active = true;
		setLoadFailed(false);
		loadDoll(Number(id)).then(
			(found) => active && setDoll(found ?? null),
			() => active && setLoadFailed(true)
		);
		return () => {
			active = false;
		};
	}, [id, loadAttempt]);

	// Opened from the doll page, going back returns to it. Opened from a pasted link there is nothing to go back to,
	// so the doll page opens instead.
	const close = useCallback(() => {
		if (openedKey.current !== "default") {
			void navigate(-1);
			return;
		}
		void navigate(`/tdoll/${id ?? ""}`, { replace: true });
	}, [navigate, id]);

	useCloseOnEscape(close);

	useEffect(() => {
		if (doll) {
			document.title = `${doll.normal.name} Live2D`;
		}
	}, [doll]);

	const handleRetryLoad = useCallback(() => setLoadAttempt((current) => current + 1), []);

	// Each control replaces the address with the whole resolved combination, so Back still closes the viewer in one
	// step and a change that lands on a fallback is reflected in the link, matching the fairy viewer's rank picker.
	const handleFormChange = useCallback(
		(_event: unknown, value: string | null) => {
			if (value === null || !forms || !selection) {
				return;
			}
			const next = resolveSelection(forms, value, selection.skinKey, selection.variant);
			setSearchParams({ form: next.form, skin: next.skinKey, variant: next.variant }, { replace: true });
		},
		[forms, selection, setSearchParams]
	);

	const handleSkinChange = useCallback(
		(_event: unknown, value: string | null) => {
			if (value === null || !forms || !selection) {
				return;
			}
			const next = resolveSelection(forms, selection.form, value, selection.variant);
			setSearchParams({ form: next.form, skin: next.skinKey, variant: next.variant }, { replace: true });
		},
		[forms, selection, setSearchParams]
	);

	const handleVariantChange = useCallback(
		(_event: unknown, value: string | null) => {
			if (value === null || !forms || !selection) {
				return;
			}
			const next = resolveSelection(forms, selection.form, selection.skinKey, value);
			setSearchParams({ form: next.form, skin: next.skinKey, variant: next.variant }, { replace: true });
		},
		[forms, selection, setSearchParams]
	);

	const handleTileToggle = useCallback((value?: string | number) => live2dStage.playMotion(String(value)), [live2dStage.playMotion]);

	// A click anywhere on the stage advances to the next motion in the tile order, same as the doll card and the fairy viewer.
	// No hit-area testing: it pre-empted the motion cycle and made middle clicks appear dead, so it was deliberately removed
	// from the fairy viewer (commit e6b8bab) and is never added here.
	const handleStageClick = useCallback(() => {
		if (zoom.wasDragged()) {
			return;
		}
		live2dStage.advance();
	}, [zoom.wasDragged, live2dStage.advance]);

	if (doll === null) {
		return <NotFound404 message={`There is no T-Doll with the id ${id ?? ""}.`} />;
	}

	const showControls = hasModel && !loadFailed;

	return (
		<Box sx={styles.root}>
			<Box sx={styles.header}>
				<IconButton onClick={close} aria-label="close" sx={styles.iconButton}>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" noWrap sx={styles.title}>
					{doll?.normal.name ?? (loadFailed ? "" : "Loading...")}
				</Typography>
				{showControls ? <ArtZoomControls zoom={zoom} /> : null}
			</Box>

			{loadFailed ? (
				<Box sx={styles.centred}>
					<LoadError what="this T-Doll" onRetry={handleRetryLoad} titleComponent="h1" />
				</Box>
			) : forms === null ? (
				<Box sx={styles.centred}>
					<Typography variant="body2" color="common.white" sx={{ opacity: 0.7 }}>
						Loading...
					</Typography>
				</Box>
			) : !hasModel ? (
				<Box sx={styles.placeholderStage}>
					<Box sx={styles.placeholderBox}>
						<ArtPlaceholder name={doll?.normal.name ?? "This T-Doll"} sx={styles.placeholder} />
					</Box>
				</Box>
			) : (
				// Always mounted once a model is expected, since the zoom hook attaches its wheel and resize listeners to this box once, on mount.
				<Box ref={zoom.containerRef} sx={styles.stage} style={zoom.containerStyle} {...zoom.handlers} onClick={handleStageClick}>
					<Box key={modelUrl} component="canvas" ref={canvasRef} sx={styles.canvas} style={zoom.contentStyle} />
					{live2dStage.status === "error" ? (
						<Box sx={styles.statusOverlay}>
							<LoadError what="this model" onRetry={live2dStage.retry} />
						</Box>
					) : live2dStage.status === "loading" ? (
						<Box sx={styles.statusOverlay}>
							<Typography variant="body2" color="common.white" sx={{ opacity: 0.7 }}>
								Loading...
							</Typography>
						</Box>
					) : null}
				</Box>
			)}

			{showControls && selection ? (
				<Box sx={styles.footer}>
					{formKeys.length > 1 ? (
						<ToggleButtonGroup size="small" exclusive value={selection.form} onChange={handleFormChange} sx={styles.pickerRow} aria-label="Form">
							{formKeys.map((form) => (
								<ToggleButton key={form} value={form}>
									{formLabel(form)}
								</ToggleButton>
							))}
						</ToggleButtonGroup>
					) : null}

					{skinKeys.length > 1 ? (
						<ToggleButtonGroup size="small" exclusive value={selection.skinKey} onChange={handleSkinChange} sx={styles.pickerRow} aria-label="Skin">
							{skinKeys.map((skinKey) => (
								<ToggleButton key={skinKey} value={skinKey}>
									{skinLabel(skinKey, doll)}
								</ToggleButton>
							))}
						</ToggleButtonGroup>
					) : null}

					{variants.length > 1 ? (
						<ToggleButtonGroup size="small" exclusive value={selection.variant} onChange={handleVariantChange} sx={styles.pickerRow} aria-label="Live2D variant">
							<ToggleButton value="normal">Normal</ToggleButton>
							<ToggleButton value="damaged">Damaged</ToggleButton>
						</ToggleButtonGroup>
					) : null}

					<Box component="ul" sx={styles.tiles} aria-label="Motions">
						{tabs.map((tab) => (
							<li key={tab.value}>
								<FilterChip label={tab.label} selected={tab.value === live2dStage.motion} value={tab.value} onToggle={handleTileToggle} />
							</li>
						))}
					</Box>

					{dialogueLine ? (
						<Typography variant="body2" sx={styles.dialogueLine}>
							{dialogueLine}
						</Typography>
					) : null}
				</Box>
			) : null}
		</Box>
	);
}
