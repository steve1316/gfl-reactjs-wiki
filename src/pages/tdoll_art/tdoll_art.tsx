import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ArtPlaceholder from "../../components/ArtPlaceholder";
import ArtZoomControls from "../../components/ArtZoomControls";
import LoadError from "../../components/LoadError";
import { useArtPanBounds, useCloseOnEscape } from "../../hooks/useArtViewer";
import { useZoomPan } from "../../hooks/useZoomPan";
import { containArtSx } from "../../lib/artLayout";
import { skinFormKey, skinKeyOf } from "../../lib/assets";
import { loadDoll } from "../../lib/data";
import NotFound404 from "../../not_found_404";
import type { RawSkins, TDoll } from "../../types/tdoll";

/**
 * Sort rank for a form key: Base first, then skins in the order `DollHero` shows their pills, then Mod last.
 *
 * @param key The form's key, such as `normal`, `skin-805` or `mod`.
 * @param skinKeys The doll's skin keys, in pill order.
 * @returns A rank to sort by, ascending.
 */
function formRank(key: string, skinKeys: string[]): number {
	if (key === "normal") {
		return 0;
	}
	if (key === "mod") {
		return skinKeys.length + 2;
	}
	const skinKey = skinKeyOf(key);
	const position = skinKey === null ? -1 : skinKeys.indexOf(skinKey);
	return position === -1 ? skinKeys.length + 1 : position + 1;
}

/**
 * The human-readable label for a form key, matching what `DollHero` shows for the same doll.
 *
 * @param key The form's key, such as `normal`, `skin-805` or `mod`.
 * @param skins The doll's skins, or null when it has none.
 * @param skinKeys The doll's skin keys, parallel to `skins.skin_names`.
 * @returns The label to show on the form's toggle button.
 */
function formLabel(key: string, skins: RawSkins | null, skinKeys: string[]): string {
	if (key === "normal") {
		return "Base";
	}
	if (key === "mod") {
		return "MOD";
	}
	const skinKey = skinKeyOf(key);
	return (skinKey === null ? undefined : skins?.skin_names[skinKeys.indexOf(skinKey)]) ?? key;
}

/**
 * Resolve the `form` parameter to a form key.
 *
 * Links from before the skin-id layout name a skin by its 1-based position, as `skinN`, so those are mapped onto the Nth skin's key.
 *
 * @param param The `form` parameter.
 * @param doll The doll being viewed.
 * @returns The form key, such as `skin-805`, or the parameter unchanged when it is not an old positional key.
 */
function resolveFormKey(param: string, doll: TDoll): string {
	const position = /^skin(\d+)$/.exec(param)?.[1];
	const skinId = position === undefined ? undefined : doll.skins?.skin_ids[Number(position) - 1];
	return skinId === null || skinId === undefined ? param : skinFormKey(skinId);
}

/**
 * Full-screen viewer for a doll's full art.
 *
 * A route rather than an overlay, so the browser Back button closes it and the view can be linked to.
 * The backdrop this replaces showed the 1024x1024 art letterboxed to about 384x384 on a phone, with no
 * zoom of any kind, and closed on any tap anywhere.
 *
 * @returns The viewer.
 */
export default function TDollArt() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	// Undefined while loading and null when no doll has this id.
	const [doll, setDoll] = useState<TDoll | null | undefined>(undefined);
	// True when the doll's shard failed to load, which shows a retry notice with only the close button.
	const [loadFailed, setLoadFailed] = useState(false);
	// Bumped by the retry button to load the doll again.
	const [loadAttempt, setLoadAttempt] = useState(0);
	// The doll page links here with the form and damaged state it was showing, so the viewer opens on the same art.
	// A form without full art falls back to the first one below.
	const [searchParams] = useSearchParams();
	const [damaged, setDamaged] = useState(() => searchParams.get("damaged") === "1");
	const [formKey, setFormKey] = useState(() => searchParams.get("form") ?? "normal");
	// The Mod wearing a skin has no full art of its own, so the doll page links to the skin with `mod=1`. Kept so closing returns to the Mod.
	const [modSkin] = useState(() => searchParams.get("mod") === "1");

	// The art element fills the stage, so its box is the stage's size and its natural size gives the drawn picture's shape.
	const artRef = useRef<HTMLImageElement | null>(null);

	const panBounds = useArtPanBounds(artRef);

	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 6, doubleScale: 2.5, panBounds });

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

	// Every form the doll actually published with full art. A form with only cards is filtered out here rather than offered as a
	// button that opens onto a broken image. Labels and order match DollHero, which reads the same skin names from skins.skin_names.
	const forms = useMemo(() => {
		if (!doll) {
			return [];
		}
		const skinKeys = (doll.skins?.skin_ids ?? []).map((skinId) => String(skinId));
		return Object.entries(doll.forms)
			.filter(([, form]) => form.images.full)
			.map(([key, form]) => ({ key, label: formLabel(key, doll.skins, skinKeys), images: form.images }))
			.sort((a, b) => formRank(a.key, skinKeys) - formRank(b.key, skinKeys));
	}, [doll]);

	const current = (doll ? forms.find((form) => form.key === resolveFormKey(formKey, doll)) : undefined) ?? forms[0];
	const source = damaged ? current?.images.full_damaged : current?.images.full;
	// A loaded doll with no full art at all, such as one released before its art is hosted. The viewer then shows a notice
	// with only the close button, rather than a black screen and controls that do nothing.
	const noArt = doll !== undefined && forms.length === 0;
	// Zoom and form controls only make sense once there is art to act on.
	const showControls = !noArt && !loadFailed;

	// Opened from the doll page, going back returns to it exactly as it was left, since that page keeps its skin, Mod and
	// damaged choice in its address. Opened from a pasted link there is nothing to go back to, so the doll page opens on
	// the art being viewed instead.
	const close = useCallback(() => {
		if (location.key !== "default") {
			void navigate(-1);
			return;
		}
		const back = new URLSearchParams();
		const key = current?.key ?? "normal";
		const skinKey = skinKeyOf(key);
		if (key === "mod" || (modSkin && skinKey !== null)) {
			back.set("mod", "1");
		}
		if (skinKey !== null) {
			back.set("skin", skinKey);
		}
		if (damaged) {
			back.set("damaged", "1");
		}
		const query = back.toString();
		void navigate(`/tdoll/${id ?? ""}${query ? `?${query}` : ""}`, { replace: true });
	}, [location.key, navigate, id, current?.key, modSkin, damaged]);

	useCloseOnEscape(close);

	useEffect(() => {
		if (doll) {
			document.title = `${doll.normal.name} - full art`;
		}
	}, [doll]);

	// Stable handlers, in step with the rest of the site.
	const handleFormChange = useCallback((_event: unknown, value: string | null) => {
		if (value) {
			setFormKey(String(value));
		}
	}, []);
	const handleDamagedChange = useCallback((_event: unknown, value: boolean | null) => {
		if (value !== null) {
			setDamaged(Boolean(value));
		}
	}, []);
	const handleRetryLoad = useCallback(() => setLoadAttempt((current) => current + 1), []);

	if (doll === null) {
		return <NotFound404 message={`There is no T-Doll with the id ${id ?? ""}.`} />;
	}

	return (
		<Box sx={{ position: "fixed", inset: 0, bgcolor: "common.black", zIndex: (theme) => theme.zIndex.modal, display: "flex", flexDirection: "column" }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, color: "common.white" }}>
				<IconButton onClick={close} aria-label="close" sx={{ color: "inherit" }}>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
					{doll?.normal.name ?? (loadFailed ? "" : "Loading...")}
				</Typography>
				{!showControls ? null : <ArtZoomControls zoom={zoom} />}
			</Box>

			{loadFailed ? (
				<Box sx={{ flexGrow: 1, display: "grid", placeItems: "center" }}>
					<LoadError what="this T-Doll's art" onRetry={handleRetryLoad} titleComponent="h1" />
				</Box>
			) : noArt ? (
				<Box sx={{ flexGrow: 1, display: "grid", placeItems: "center", p: 2 }}>
					<Box sx={{ width: 256, maxWidth: "60vw" }}>
						<ArtPlaceholder name={doll.normal.name} />
					</Box>
				</Box>
			) : (
				<Box ref={zoom.containerRef} sx={{ flexGrow: 1, position: "relative", overflow: "hidden" }} style={zoom.containerStyle} {...zoom.handlers}>
					{/* Not draggable: a mouse drag on an image otherwise starts the browser's own image drag, which cancels the pan. */}
					{source ? <Box component="img" ref={artRef} src={source} alt="" draggable={false} sx={containArtSx} style={zoom.contentStyle} /> : null}
				</Box>
			)}

			{!showControls ? null : (
				<Box sx={{ display: "flex", gap: 1, p: 1, flexWrap: "wrap", justifyContent: "center" }}>
					{/* Wraps so a doll with many skins keeps every button on a phone screen instead of spilling off both edges. */}
					<ToggleButtonGroup size="small" exclusive value={current?.key ?? formKey} onChange={handleFormChange} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
						{forms.map((form) => (
							<ToggleButton key={form.key} value={form.key} sx={{ color: "common.white" }}>
								{form.label}
							</ToggleButton>
						))}
					</ToggleButtonGroup>
					<ToggleButtonGroup size="small" exclusive value={damaged} onChange={handleDamagedChange}>
						<ToggleButton value={false} sx={{ color: "common.white" }}>
							Normal
						</ToggleButton>
						<ToggleButton value={true} sx={{ color: "common.white" }}>
							Damaged
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>
			)}
		</Box>
	);
}
