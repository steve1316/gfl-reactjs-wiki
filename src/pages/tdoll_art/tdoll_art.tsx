import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

import { useZoomPan } from "../../hooks/useZoomPan";
import { loadDoll } from "../../lib/data";
import type { TDoll } from "../../types/tdoll";

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
	const [doll, setDoll] = useState<TDoll | undefined>(undefined);
	const [damaged, setDamaged] = useState(false);
	const [formKey, setFormKey] = useState("normal");

	const zoom = useZoomPan({ minScale: 1, maxScale: 6, doubleScale: 2.5 });

	useEffect(() => {
		let active = true;
		void loadDoll(Number(id)).then((found) => {
			if (active) {
				setDoll(found);
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
	// they are filtered out here rather than offered as a button that opens onto a broken image.
	const forms = useMemo(() => {
		if (!doll) {
			return [];
		}
		return Object.entries(doll.forms)
			.filter(([, form]) => form.images.full)
			.map(([key, form]) => ({ key, label: key === "normal" ? "Base" : key, images: form.images }));
	}, [doll]);

	const current = forms.find((form) => form.key === formKey) ?? forms[0];
	const source = damaged ? current?.images.full_damaged : current?.images.full;

	useEffect(() => {
		if (doll) {
			document.title = `${doll.normal.name} - full art`;
		}
	}, [doll]);

	return (
		<Box sx={{ position: "fixed", inset: 0, bgcolor: "common.black", zIndex: (theme) => theme.zIndex.modal, display: "flex", flexDirection: "column" }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, color: "common.white" }}>
				<IconButton onClick={close} aria-label="close" sx={{ color: "inherit" }}>
					<CloseIcon />
				</IconButton>
				<Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
					{doll?.normal.name ?? "Loading..."}
				</Typography>
				<IconButton onClick={() => zoom.zoomBy(1 / 1.4)} aria-label="zoom out" sx={{ color: "inherit" }}>
					<RemoveIcon />
				</IconButton>
				<IconButton onClick={() => zoom.zoomBy(1.4)} aria-label="zoom in" sx={{ color: "inherit" }}>
					<AddIcon />
				</IconButton>
				<IconButton onClick={zoom.reset} aria-label="reset zoom" sx={{ color: "inherit" }}>
					<ZoomOutMapIcon />
				</IconButton>
			</Box>

			{/* touchAction is set here, not just on the image: this element is what receives the pointer handlers, and the
			    browser only stops claiming a gesture for scrolling on the element the listener is actually attached to.
			    onDoubleClick is recast: the hook types every handler as a pointer handler since pinch and drag share pointer
			    events, but a native double click fires as a MouseEvent. The handler body only calls preventDefault and reads
			    the current scale, so the cast is safe. */}
			<Box
				sx={{ flexGrow: 1, overflow: "hidden", display: "grid", placeItems: "center", touchAction: "none" }}
				{...zoom.handlers}
				onDoubleClick={(event) => zoom.handlers.onDoubleClick(event as never)}
			>
				{source ? <Box component="img" src={source} alt="" sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} style={zoom.contentStyle} /> : null}
			</Box>

			<Box sx={{ display: "flex", gap: 1, p: 1, flexWrap: "wrap", justifyContent: "center" }}>
				<ToggleButtonGroup size="small" exclusive value={formKey} onChange={(_event, value) => value && setFormKey(String(value))}>
					{forms.map((form) => (
						<ToggleButton key={form.key} value={form.key} sx={{ color: "common.white" }}>
							{form.label}
						</ToggleButton>
					))}
				</ToggleButtonGroup>
				<ToggleButtonGroup size="small" exclusive value={damaged} onChange={(_event, value) => value !== null && setDamaged(Boolean(value))}>
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
