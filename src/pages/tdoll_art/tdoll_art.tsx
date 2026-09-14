import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import ArtPlaceholder from "../../components/ArtPlaceholder";
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
		return "Mod";
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
	// The doll page links here with the form and damaged state it was showing, so the viewer opens on the same art.
	// A form without full art falls back to the first one below.
	const [searchParams] = useSearchParams();
	const [damaged, setDamaged] = useState(() => searchParams.get("damaged") === "1");
	const [formKey, setFormKey] = useState(() => searchParams.get("form") ?? "normal");

	const zoom = useZoomPan<HTMLDivElement>({ minScale: 1, maxScale: 6, doubleScale: 2.5 });

	useEffect(() => {
		let active = true;
		void loadDoll(Number(id)).then((found) => {
			if (active) {
				setDoll(found ?? null);
			}
		});
		return () => {
			active = false;
		};
	}, [id]);

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
		if (key === "mod") {
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
	}, [location.key, navigate, id, current?.key, damaged]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [close]);

	useEffect(() => {
		if (doll) {
			document.title = `${doll.normal.name} - full art`;
		}
	}, [doll]);

	// Stable handlers, in step with the rest of the site.
	const zoomIn = useCallback(() => zoom.zoomBy(1.4), [zoom.zoomBy]);
	const zoomOut = useCallback(() => zoom.zoomBy(1 / 1.4), [zoom.zoomBy]);
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
					{doll?.normal.name ?? "Loading..."}
				</Typography>
				{noArt ? null : (
					<>
						<IconButton onClick={zoomOut} aria-label="zoom out" sx={{ color: "inherit" }}>
							<RemoveIcon />
						</IconButton>
						<IconButton onClick={zoomIn} aria-label="zoom in" sx={{ color: "inherit" }}>
							<AddIcon />
						</IconButton>
						<IconButton onClick={zoom.reset} aria-label="reset zoom" sx={{ color: "inherit" }}>
							<ZoomOutMapIcon />
						</IconButton>
					</>
				)}
			</Box>

			{noArt ? (
				<Box sx={{ flexGrow: 1, display: "grid", placeItems: "center", p: 2 }}>
					<Box sx={{ width: 256, maxWidth: "60vw" }}>
						<ArtPlaceholder name={doll.normal.name} />
					</Box>
				</Box>
			) : (
				<Box ref={zoom.containerRef} sx={{ flexGrow: 1, overflow: "hidden", display: "grid", placeItems: "center" }} style={zoom.containerStyle} {...zoom.handlers}>
					{source ? <Box component="img" src={source} alt="" sx={containArtSx} style={zoom.contentStyle} /> : null}
				</Box>
			)}

			{noArt ? null : (
				<Box sx={{ display: "flex", gap: 1, p: 1, flexWrap: "wrap", justifyContent: "center" }}>
					<ToggleButtonGroup size="small" exclusive value={current?.key ?? formKey} onChange={handleFormChange}>
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
