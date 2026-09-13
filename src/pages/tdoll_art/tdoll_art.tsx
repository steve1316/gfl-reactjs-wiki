import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import { useZoomPan } from "../../hooks/useZoomPan";
import { containArtSx } from "../../lib/artLayout";
import { loadDoll } from "../../lib/data";
import NotFound404 from "../../not_found_404";
import type { TDoll } from "../../types/tdoll";

/**
 * Sort rank for a form key: Base first, then skins in order, then Mod last.
 *
 * @param key The form's key, such as `normal`, `skin1` or `mod`.
 * @returns A rank to sort by, ascending.
 */
function formRank(key: string): number {
	if (key === "normal") {
		return 0;
	}
	if (key === "mod") {
		return 2;
	}
	return 1;
}

/**
 * The skin number encoded in a `skinN` form key, for ordering skins amongst themselves.
 *
 * @param key The form's key.
 * @returns The skin's 1-based number, or 0 for a non-skin key.
 */
function skinNumber(key: string): number {
	const match = /^skin(\d+)$/.exec(key);
	return match ? Number(match[1]) : 0;
}

/**
 * The human-readable label for a form key, matching what `DollHero` shows for the same doll.
 *
 * @param key The form's key, such as `normal`, `skin1` or `mod`.
 * @param skinNames The doll's skin names, in skin order, from `skins.skin_names`.
 * @returns The label to show on the form's toggle button.
 */
function formLabel(key: string, skinNames: string[]): string {
	if (key === "normal") {
		return "Base";
	}
	if (key === "mod") {
		return "Mod";
	}
	const number = skinNumber(key);
	return (number > 0 ? skinNames[number - 1] : undefined) ?? key;
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
	// Undefined while loading and null when no doll has this id.
	const [doll, setDoll] = useState<TDoll | null | undefined>(undefined);
	const [damaged, setDamaged] = useState(false);
	const [formKey, setFormKey] = useState("normal");

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

	const close = useCallback(() => {
		void navigate(`/tdoll/${id ?? ""}`);
	}, [navigate, id]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [close]);

	// Every form the doll actually published with full art. Mod-skin forms only ever carry card art, so
	// they are filtered out here rather than offered as a button that opens onto a broken image. Labels
	// and order match DollHero, which reads the same skin names from skins.skin_names.
	const forms = useMemo(() => {
		if (!doll) {
			return [];
		}
		const skinNames = doll.skins?.skin_names ?? [];
		return Object.entries(doll.forms)
			.filter(([, form]) => form.images.full)
			.map(([key, form]) => ({ key, label: formLabel(key, skinNames), images: form.images }))
			.sort((a, b) => formRank(a.key) - formRank(b.key) || skinNumber(a.key) - skinNumber(b.key));
	}, [doll]);

	const current = forms.find((form) => form.key === formKey) ?? forms[0];
	const source = damaged ? current?.images.full_damaged : current?.images.full;

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
				<IconButton onClick={zoomOut} aria-label="zoom out" sx={{ color: "inherit" }}>
					<RemoveIcon />
				</IconButton>
				<IconButton onClick={zoomIn} aria-label="zoom in" sx={{ color: "inherit" }}>
					<AddIcon />
				</IconButton>
				<IconButton onClick={zoom.reset} aria-label="reset zoom" sx={{ color: "inherit" }}>
					<ZoomOutMapIcon />
				</IconButton>
			</Box>

			<Box ref={zoom.containerRef} sx={{ flexGrow: 1, overflow: "hidden", display: "grid", placeItems: "center" }} style={zoom.containerStyle} {...zoom.handlers}>
				{source ? <Box component="img" src={source} alt="" sx={containArtSx} style={zoom.contentStyle} /> : null}
			</Box>

			<Box sx={{ display: "flex", gap: 1, p: 1, flexWrap: "wrap", justifyContent: "center" }}>
				<ToggleButtonGroup size="small" exclusive value={formKey} onChange={handleFormChange}>
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
		</Box>
	);
}
