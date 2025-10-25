// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////
// Inline stage styles shared by the in-page animation players

// Module constants rather than inline objects, since an inline object is a new `style` prop on every render.

/** The clickable Spine stage wrapper. */
export const STAGE_STYLE = { cursor: "pointer" } as const;

/** The square Live2D stage, sized directly on the flex item the card hands it rather than an inner width:100% that would collapse to 0. */
export const LIVE2D_STAGE_STYLE = { width: "100%", maxWidth: 340, aspectRatio: "1 / 1", position: "relative", cursor: "pointer" } as const;

/** Fills the Live2D stage box exactly, matching the full-page Live2D viewers' canvas style. */
export const LIVE2D_CANVAS_STYLE = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" } as const;

/** Centred loading/error text over the Live2D stage, matching `SpineAnimation`'s own status overlay. */
export const LIVE2D_STATUS_STYLE = {
	position: "absolute",
	inset: 0,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "0.85rem",
	opacity: 0.7
} as const;
