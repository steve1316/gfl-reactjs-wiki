import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { enemySpineImageBase, enemySpineUrl, spineImageBase, spineUrl } from "../../lib/assets";
import { loadEnemySpineRigs, loadSpineRigs } from "../../lib/data";
import { MOD_ID_OFFSET } from "../../lib/formation/pipeline";
import type { PlacedForm } from "../../lib/formation/pipeline";
import { GRID_CELLS, TILE_STAT_SHORT, appliesTo, tileReach, tileTotals } from "../../lib/formation/tiles";
import type { TileSource } from "../../lib/formation/tiles";
import type { FormationEnemy, FormationTile } from "../../types/formation";
import { STAGE_DESTROYED_MESSAGE, createSpineStage } from "../../lib/spineStage";
import type { SpineStage, StageActor } from "../../lib/spineStage";
import type { SpineDollEntry, SpineRigPair } from "../../types/spine";
import { dollName } from "./dollNames";
import { cellAt, cellAtSide, stageGeometry, tileCentre, tilePoints } from "./isometric";
import type { StageSide } from "./isometric";

/** How long a moved chibi takes to walk to its new tile, in milliseconds. */
const WALK_MS = 700;

/** Chibi scale per CSS pixel of tile width. Tuned so a chibi is about one and a half tiles tall. */
const CHIBI_SCALE_PER_TILE_PX = 1 / 170;

/** Pixels a pointer can travel between press and release and still count as a click. */
const DRAG_THRESHOLD = 6;

/** Padding inside a label pill, each side, as a share of font size. */
const LABEL_PILL_PADDING = 0.55;

/** Label font size as a share of tile width, so labels on neighbouring tiles do not run into each other. */
const LABEL_FONT_SHARE = 0.045;

/** How far below a tile's centre its label sits, as a share of tile height, which keeps it clear of the doll's own body. */
const LABEL_TILE_OFFSET = 0.36;

/** Smallest label font size in CSS pixels. */
const LABEL_MIN_FONT = 9;

/** Stat name size and opacity against its number, so the numbers read first. */
const LABEL_NAME_SHARE = 0.9;
const LABEL_NAME_OPACITY = 0.75;

/** Opacity of the dot between two stats. */
const LABEL_SEPARATOR_OPACITY = 0.35;

/** Label pill height as a multiple of font size. */
const LABEL_PILL_HEIGHT = 1.9;

/** Fill opacity of the tiles the focused doll's buffs reach. */
const REACH_OPACITY = 0.35;

/** Width changes smaller than this, in CSS pixels, are ignored so a scrollbar toggling cannot make the stage resize in a loop. */
const MIN_WIDTH_CHANGE = 2;

/**
 * Animation a held chibi plays. Every doll's dorm rig has `pick`, but only the 58 capturable Ringleaders' rigs do - the rest of the
 * enemies never go to the dorm, so their skeletons were never given one. Those fall back to `wait`, which every rig has.
 */
const HELD_ANIM = "pick";

/** Animation a chibi plays while it stands on its tile. The one animation every rig in the game defines. */
const IDLE_ANIM = "wait";

/** One enemy standing on the opposing grid. */
export interface PlacedEnemy {
	/** Cell on the enemy grid, 0 to 8. */
	cell: number;
	/** The enemy it shows. */
	enemy: FormationEnemy;
}

/** Props for FormationStage. */
interface FormationStageProps {
	/** Dolls on the grid with their forms. A new array only when the echelon changes, since actors sync on its identity. */
	placed: readonly PlacedForm[];
	/** Tile buffs per cell for `placed`. */
	sources: readonly (readonly TileSource[])[];
	/** A held doll moved over a tile, or was put down. The page previews the drop so every number follows the drag. */
	onDragPreview: (preview: { from: number; over: number } | null) => void;
	/** Cell whose modal is open, outlined. */
	selectedCell: number | null;
	/** Cell of a doll being moved by tapping its target, or null. */
	moveFrom: number | null;
	/** A tile was clicked. */
	onTileClick: (cell: number) => void;
	/** A doll was dragged, or tapped-to-move, from one cell to another. */
	onMove: (from: number, to: number) => void;
	/** Tap-to-move was cancelled by tapping the doll's own tile or somewhere off the grid. */
	onCancelMove: () => void;
	/** Whether dragging a doll picks it up, true when left out. Off on phones, where a one-finger drag pans the stage instead. */
	canDrag?: boolean;
	/** Whether each buffed tile shows its summed stat totals, true when left out. */
	showTotals?: boolean;
	/** Enemies on the opposing grid, each with the cell it stands on. */
	enemies: readonly PlacedEnemy[];
	/** A tile on the opposing grid was clicked. */
	onEnemyTileClick: (cell: number) => void;
	/** An enemy was dragged from one cell of the opposing grid to another. */
	onEnemyMove: (from: number, to: number) => void;
}

/** A chibi actor and what it is showing. */
interface ActorEntry {
	/** The actor. */
	actor: StageActor;
	/** Cell it stands on. */
	cell: number;
	/** Gun id of the form it shows. */
	formId: number;
	/**
	 * The doll's dorm chibi, kept hidden until the doll is picked up, so the pick animation starts with no wait.
	 *
	 * It is loaded as soon as the combat chibi is standing, which costs one extra skeleton file: the dorm rig shares
	 * the combat atlas, so its page images are already in the browser's cache.
	 */
	dorm: StageActor | null;
	/** How far the dorm chibi has got, so a failed or absent rig is not asked for again on every render. */
	dormState: "missing" | "loading" | "ready";
}

/** An enemy chibi on the stage. */
interface EnemyActorEntry {
	/** The actor. */
	actor: StageActor;
	/** Cell of the enemy grid it stands on. */
	cell: number;
	/** The enemy it shows. */
	enemyId: number;
}

/** A doll picked up and being dragged to another tile. */
interface HeldDoll {
	/** Id of the held doll. */
	dollId: number;
	/** Cell it was picked up from. */
	fromCell: number;
	/** Latest pointer x, in stage pixels. */
	x: number;
	/** Latest pointer y, in stage pixels. */
	y: number;
}

/** An enemy picked up and being dragged to another tile of its own grid. */
interface HeldEnemy {
	/** Cell it was picked up from. */
	fromCell: number;
	/** Latest pointer x, in stage pixels. */
	x: number;
	/** Latest pointer y, in stage pixels. */
	y: number;
}

/** Where a held doll came from and the tile under the pointer, for the tile highlight. */
interface DragCells {
	/** Cell the doll was picked up from. */
	from: number;
	/** Cell under the pointer, or null off the grid. */
	over: number | null;
}

/**
 * Measure text in the font a label draws it in.
 *
 * The pill used to be sized from the character count, which left a wide gap at each end, since digits and spaces are much narrower than the
 * average character. One canvas is kept for the page's lifetime, since creating one per measurement is far more expensive than the measure.
 *
 * @param text The text.
 * @param font A CSS font shorthand, such as `700 12px Roboto`.
 * @returns The width in CSS pixels.
 */
const measureText = (() => {
	const context = document.createElement("canvas").getContext("2d");
	return (text: string, font: string) => {
		if (!context) {
			return text.length * 6;
		}
		context.font = font;
		return context.measureText(text).width;
	};
})();

/** One stat's total on a tile, as the label writes it. */
interface LabelPart {
	/** Short stat name, such as `DMG`. */
	name: string;
	/** Summed percentage, to one decimal place. */
	value: number;
}

/**
 * One tile's totals, as one line such as `DMG 50 · RoF 15`.
 *
 * Every tile buff is a percentage, so the labels leave the sign and the per-cent off and the hover card spells them out in full.
 *
 * @param sources Buffs on the cell to total.
 * @returns One part per stat that has any buff, in display order.
 */
function labelParts(sources: readonly TileSource[]): LabelPart[] {
	return tileTotals(sources).map(({ code, total }) => ({ name: TILE_STAT_SHORT[code], value: Math.round(total * 10) / 10 }));
}

/**
 * The rigs for a form: the Mod's for a Mod form id, otherwise the base doll's.
 *
 * @param rigs The doll's rigs.
 * @param formId Gun id of the form.
 * @returns The form's combat and dorm rigs, or undefined when none were published.
 */
function formRigs(rigs: SpineDollEntry | undefined, formId: number): SpineRigPair | undefined {
	return formId >= MOD_ID_OFFSET ? rigs?.mod : rigs;
}

/**
 * Log a stage failure, staying quiet about the expected teardown rejection.
 *
 * @param what What failed, for the log line.
 * @param error The rejection.
 */
function reportStageError(what: string, error: unknown) {
	if (error instanceof Error && error.message === STAGE_DESTROYED_MESSAGE) {
		return;
	}
	console.error(`${what}:`, error);
}

/**
 * The isometric grid with chibis standing on their tiles, per-tile buff totals, and click, drag and tap-to-move handling.
 *
 * @param props Component props.
 * @returns The stage.
 */
export default memo(function FormationStage({
	placed,
	sources,
	selectedCell,
	moveFrom,
	onTileClick,
	onMove,
	onCancelMove,
	canDrag = true,
	showTotals = true,
	onDragPreview,
	enemies,
	onEnemyTileClick,
	onEnemyMove
}: FormationStageProps) {
	const theme = useTheme();
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const canvasHostRef = useRef<HTMLDivElement | null>(null);
	const stageRef = useRef<SpineStage | null>(null);
	const actorsRef = useRef(new Map<number, ActorEntry>());
	// The latest wanted actor per doll id, read when a load resolves, and the form id each in-flight load is for.
	const wantedRef = useRef(new Map<number, Pick<ActorEntry, "cell" | "formId">>());
	const pendingRef = useRef(new Map<number, number>());
	const enemyActorsRef = useRef(new Map<number, EnemyActorEntry>());
	const enemyWantedRef = useRef(new Map<number, FormationEnemy>());
	const enemyPendingRef = useRef(new Map<number, number>());
	const heldEnemyRef = useRef<HeldEnemy | null>(null);
	const enemyOverRef = useRef<number | null>(null);
	// Where a press landed, including which grid it was on, so the release can tell an enemy tap from a doll tap without testing again.
	const pressRef = useRef<{ hit: { side: StageSide; cell: number } | null; x: number; y: number } | null>(null);
	const heldRef = useRef<HeldDoll | null>(null);
	// The tile a held doll is over, mirrored outside state so a pointer move can tell a real change from a repeat without reading state.
	const overRef = useRef<number | null>(null);
	// Dolls a drop just rearranged, which stand on their new tiles at once instead of walking: the drop already placed them.
	const droppedRef = useRef(new Set<number>());
	// True while mounted, and set once the canvas has been requested so it is only ever created once.
	const mountedRef = useRef(false);
	const stageRequestedRef = useRef(false);
	const [width, setWidth] = useState(0);
	const [stageReady, setStageReady] = useState(false);
	const [hoveredCell, setHoveredCell] = useState<number | null>(null);
	const [drag, setDrag] = useState<DragCells | null>(null);
	// The enemy tile a drag would drop onto. Unlike a doll drag there is no second cell to track, since the tile it came from is not marked.
	const [enemyOver, setEnemyOver] = useState<number | null>(null);
	const geometry = useMemo(() => stageGeometry(width), [width]);
	// Latest geometry for actors that finish loading after a resize.
	const geometryRef = useRef(geometry);

	const occupant = useMemo(() => new Map(placed.map((entry) => [entry.setup.cell, entry])), [placed]);
	// Only whether a tile is taken is ever asked, so the enemies become a set of cells beside the doll lookup.
	const enemyCells = useMemo(() => new Set(enemies.map((entry) => entry.cell)), [enemies]);
	// The doll whose buff reach is lit, and the cell it is lit from: a held doll over its drop tile, then tap-to-move, the open modal and the
	// hovered doll, like the game only lighting the selected doll's tiles.
	const focus = useMemo(() => {
		const at = (cell: number | null, standOn: number | null = cell): { cell: number; tile: FormationTile } | null => {
			const entry = cell === null ? undefined : occupant.get(cell);
			return entry && standOn !== null ? { cell: standOn, tile: entry.form.tile } : null;
		};
		if (drag) {
			return at(drag.from, drag.over);
		}
		// Tap-to-move previews on the tile being pointed at, as a drag does, and falls back to where the doll still stands.
		return moveFrom === null ? (at(selectedCell) ?? at(hoveredCell)) : at(moveFrom, hoveredCell ?? moveFrom);
	}, [drag, hoveredCell, moveFrom, occupant, selectedCell]);
	const reach = useMemo(() => new Set(focus ? tileReach(focus.tile, focus.cell) : []), [focus]);
	// What the hover card shows for the tile under the mouse. Hidden while a doll is held.
	const hoverCard = useMemo(() => {
		if (hoveredCell === null || drag) {
			return null;
		}
		const here = sources[hoveredCell] ?? [];
		const standing = occupant.get(hoveredCell);
		return {
			anchor: tileCentre(geometry, hoveredCell, "player"),
			title: standing ? dollName(standing.setup.dollId, standing.setup.modStage) : "Empty tile",
			rows: here.map((source) => {
				const from = occupant.get(source.fromCell);
				return {
					text: `${from ? dollName(from.setup.dollId, from.setup.modStage) : "?"}: ${TILE_STAT_SHORT[source.code]} +${Math.round(source.value * 10) / 10}%`,
					applies: !standing || appliesTo(source, standing.form.type)
				};
			})
		};
	}, [drag, geometry, hoveredCell, occupant, sources]);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) {
			return;
		}
		const observer = new ResizeObserver((entries) => {
			const next = Math.round(entries[0]?.contentRect.width ?? 0);
			setWidth((current) => (next > 0 && Math.abs(next - current) >= MIN_WIDTH_CHANGE ? next : current));
		});
		observer.observe(wrapper);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			heldRef.current = null;
			for (const entry of actorsRef.current.values()) {
				entry.actor.destroy();
				entry.dorm?.destroy();
			}
			actorsRef.current.clear();
			stageRef.current?.destroy();
			stageRef.current = null;
		};
	}, []);

	// One canvas for the page's lifetime, created once the wrapper has a width. Later width changes only resize it.
	useEffect(() => {
		if (width === 0 || stageRequestedRef.current || !canvasHostRef.current) {
			return;
		}
		stageRequestedRef.current = true;
		void createSpineStage(canvasHostRef.current, geometry.width, geometry.height, window.devicePixelRatio || 1)
			.then((stage) => {
				if (!mountedRef.current) {
					stage.destroy();
					return;
				}
				stageRef.current = stage;
				setStageReady(true);
			})
			.catch((error: unknown) => reportStageError("Formation stage failed to start", error));
	}, [geometry, width]);

	// Pause the canvas while it is off screen or the tab is hidden.
	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!stageReady || !wrapper) {
			return;
		}
		let visible = true;
		const apply = () => stageRef.current?.setPaused(!visible || document.hidden);
		const observer = new IntersectionObserver((entries) => {
			visible = entries[0]?.isIntersecting ?? true;
			apply();
		});
		observer.observe(wrapper);
		document.addEventListener("visibilitychange", apply);
		return () => {
			observer.disconnect();
			document.removeEventListener("visibilitychange", apply);
		};
	}, [stageReady]);

	useEffect(() => {
		geometryRef.current = geometry;
		if (stageReady && geometry.width > 0) {
			stageRef.current?.resize(geometry.width, geometry.height);
			for (const entry of actorsRef.current.values()) {
				const { x, y } = tileCentre(geometry, entry.cell, "player");
				entry.actor.setPosition(x, y);
				entry.actor.setScale(geometry.tileWidth * CHIBI_SCALE_PER_TILE_PX);
				entry.dorm?.setScale(geometry.tileWidth * CHIBI_SCALE_PER_TILE_PX);
			}
			for (const entry of enemyActorsRef.current.values()) {
				const { x, y } = tileCentre(geometry, entry.cell, "enemy");
				entry.actor.setPosition(x, y);
				entry.actor.setScale(geometry.tileWidth * CHIBI_SCALE_PER_TILE_PX);
			}
		}
	}, [geometry, stageReady]);

	// Show a held doll's dorm chibi in place of its combat chibi.
	const showDorm = useCallback((entry: ActorEntry, held: HeldDoll) => {
		if (!entry.dorm) {
			return;
		}
		entry.dorm.setOnTop(true);
		entry.dorm.setPosition(held.x, held.y);
		entry.dorm.play("pick");
		entry.dorm.setVisible(true);
		entry.actor.setVisible(false);
	}, []);

	// Load a doll's dorm chibi and park it hidden, ready for the next pick-up. Shown straight away if the doll is already held.
	const loadDorm = useCallback(
		(dollId: number, entry: ActorEntry) => {
			const stage = stageRef.current;
			if (!stage) {
				return;
			}
			entry.dormState = "loading";
			void loadSpineRigs(dollId)
				.then((rigs) => {
					const rig = formRigs(rigs, entry.formId)?.dorm;
					return rig
						? stage.addActor({ skelUrl: spineUrl(dollId, rig.skel, "skel"), atlasUrl: spineUrl(dollId, rig.atlas, "atlas"), imageBase: spineImageBase(dollId, rig.atlas) })
						: undefined;
				})
				.then((dorm) => {
					if (!dorm) {
						entry.dormState = "missing";
						return;
					}
					// The doll may have left or changed form while this loaded, which replaced or dropped its entry.
					if (!mountedRef.current || actorsRef.current.get(dollId) !== entry) {
						dorm.destroy();
						return;
					}
					dorm.setScale(geometryRef.current.tileWidth * CHIBI_SCALE_PER_TILE_PX);
					dorm.setVisible(false);
					entry.dorm = dorm;
					entry.dormState = "ready";
					const held = heldRef.current;
					if (held?.dollId === dollId) {
						showDorm(entry, held);
					}
				})
				.catch((error: unknown) => {
					entry.dormState = "missing";
					reportStageError(`Dorm chibi for doll ${dollId} failed to load`, error);
				});
		},
		[showDorm]
	);

	// Keep one actor per enemy tile, keyed by the cell rather than by id: the same enemy can fill more than one tile of a squad, so an
	// id is not unique here the way a doll's is.
	useEffect(() => {
		const stage = stageRef.current;
		if (!stageReady || !stage || width === 0) {
			return;
		}
		const actors = enemyActorsRef.current;
		const pending = enemyPendingRef.current;
		const wanted = new Map(enemies.map(({ cell, enemy }) => [cell, enemy]));
		enemyWantedRef.current = wanted;
		// Actors already standing on the right tile keep it, so a move or a swap only re-homes the few that changed.
		const homeless: EnemyActorEntry[] = [];
		for (const [cell, entry] of actors) {
			if (wanted.get(cell)?.id !== entry.enemyId) {
				homeless.push(entry);
				actors.delete(cell);
			}
		}
		// A dragged enemy moves tile without its rig changing, so it is re-homed rather than destroyed and loaded again, which would
		// flash a gap where it landed. Matching on the id also covers two enemies swapping tiles.
		for (const [cell, enemy] of wanted) {
			if (actors.has(cell)) {
				continue;
			}
			const index = homeless.findIndex((entry) => entry.enemyId === enemy.id);
			const entry = index === -1 ? undefined : homeless.splice(index, 1)[0];
			if (entry) {
				const { x, y } = tileCentre(geometryRef.current, cell, "enemy");
				entry.actor.setPosition(x, y);
				entry.cell = cell;
				actors.set(cell, entry);
			}
		}
		for (const entry of homeless) {
			entry.actor.destroy();
		}
		for (const [cell, enemy] of wanted) {
			if (actors.has(cell) || pending.get(cell) === enemy.id) {
				continue;
			}
			pending.set(cell, enemy.id);
			const settle = () => {
				if (pending.get(cell) === enemy.id) {
					pending.delete(cell);
				}
			};
			void loadEnemySpineRigs(enemy.id)
				.then((rigs) => {
					const rig = rigs?.combat;
					if (!rig) {
						return undefined;
					}
					return stage.addActor({
						skelUrl: enemySpineUrl(enemy.id, rig.skel, "skel"),
						atlasUrl: enemySpineUrl(enemy.id, rig.atlas, "atlas"),
						imageBase: enemySpineImageBase(enemy.id)
					});
				})
				.then((actor) => {
					settle();
					if (!actor) {
						return;
					}
					const latest = enemyWantedRef.current.get(cell);
					if (!mountedRef.current || latest?.id !== enemy.id || actors.has(cell)) {
						actor.destroy();
						return;
					}
					const { x, y } = tileCentre(geometryRef.current, cell, "enemy");
					actor.setScale(geometryRef.current.tileWidth * CHIBI_SCALE_PER_TILE_PX);
					actor.setPosition(x, y);
					actor.play("wait");
					actors.set(cell, { actor, cell, enemyId: enemy.id });
				})
				.catch((error: unknown) => {
					settle();
					reportStageError(`Enemy ${enemy.id} chibi failed to load`, error);
				});
		}
	}, [enemies, stageReady, width]);

	// Keep one actor per placed doll: walk moved dolls, swap changed forms, drop removed ones and load new ones.
	useEffect(() => {
		const stage = stageRef.current;
		if (!stageReady || !stage || width === 0) {
			return;
		}
		const actors = actorsRef.current;
		const pending = pendingRef.current;
		const wanted = new Map(placed.map(({ setup, form }) => [setup.dollId, { cell: setup.cell, formId: form.id }]));
		wantedRef.current = wanted;
		// Read once for the whole pass: clearing it inside the loop would only reach the dropped doll when it came first.
		const dropped = droppedRef.current;
		droppedRef.current = new Set();
		for (const [dollId, entry] of actors) {
			const next = wanted.get(dollId);
			if (!next || next.formId !== entry.formId) {
				entry.actor.destroy();
				entry.dorm?.destroy();
				actors.delete(dollId);
			} else if (next.cell !== entry.cell) {
				const { x, y } = tileCentre(geometry, next.cell, "player");
				entry.cell = next.cell;
				if (dropped.has(dollId)) {
					entry.actor.setPosition(x, y);
					entry.actor.play("wait");
				} else {
					entry.actor.play("move");
					entry.actor.moveTo(x, y, WALK_MS, () => entry.actor.play("wait"));
				}
			}
		}
		for (const [dollId, { formId }] of wanted) {
			// A load already running for this form will be used when it lands, so settings changes do not start another.
			if (actors.has(dollId) || pending.get(dollId) === formId) {
				continue;
			}
			pending.set(dollId, formId);
			const settle = () => {
				if (pending.get(dollId) === formId) {
					pending.delete(dollId);
				}
			};
			void loadSpineRigs(dollId)
				.then((rigs) => {
					const rig = formRigs(rigs, formId)?.combat;
					if (!rig) {
						return undefined;
					}
					return stage.addActor({ skelUrl: spineUrl(dollId, rig.skel, "skel"), atlasUrl: spineUrl(dollId, rig.atlas, "atlas"), imageBase: spineImageBase(dollId, rig.atlas) });
				})
				.then((actor) => {
					settle();
					if (!actor) {
						return;
					}
					// Checked against the latest wanted state, since the doll may have moved, changed form or left while this loaded.
					const latest = wantedRef.current.get(dollId);
					if (!mountedRef.current || !latest || latest.formId !== formId || actors.has(dollId)) {
						actor.destroy();
						return;
					}
					const live = geometryRef.current;
					const { x, y } = tileCentre(live, latest.cell, "player");
					actor.setScale(live.tileWidth * CHIBI_SCALE_PER_TILE_PX);
					actor.setPosition(x, y);
					actor.play("wait");
					const entry: ActorEntry = { actor, cell: latest.cell, formId, dorm: null, dormState: "loading" };
					actors.set(dollId, entry);
					loadDorm(dollId, entry);
				})
				.catch((error: unknown) => {
					settle();
					reportStageError(`Chibi for doll ${dollId} failed to load`, error);
				});
		}
		// A doll placed before this ran, or whose dorm load failed, gets another try here.
		for (const [dollId, entry] of actors) {
			if (entry.dormState === "missing") {
				loadDorm(dollId, entry);
			}
		}
		// Positions on resize are handled by the effect above.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadDorm, placed, stageReady]);

	// Divides out any CSS scale on an ancestor, such as the phone's pinch zoom, so the point is in stage pixels.
	const pointAt = useCallback(
		(event: PointerEvent<SVGSVGElement>) => {
			const rect = event.currentTarget.getBoundingClientRect();
			const scale = rect.width > 0 ? geometry.width / rect.width : 1;
			return { x: (event.clientX - rect.left) * scale, y: (event.clientY - rect.top) * scale };
		},
		[geometry.width]
	);

	const handlePointerDown = useCallback(
		(event: PointerEvent<SVGSVGElement>) => {
			const { x, y } = pointAt(event);
			const hit = cellAt(geometry, x, y);
			pressRef.current = { hit, x, y };
			// Touch has no hover, so a finger put down in move mode previews that tile before the tap moves the doll.
			if (moveFrom !== null) {
				setHoveredCell(hit?.side === "player" ? hit.cell : null);
			}
		},
		[geometry, moveFrom, pointAt]
	);

	// Both ends of a drop stand still: the dropped doll, and the one it swapped places with.
	const markDropped = useCallback(
		(fromCell: number, toCell: number) => {
			const moved = [occupant.get(fromCell), occupant.get(toCell)].flatMap((entry) => (entry ? [entry.setup.dollId] : []));
			droppedRef.current = new Set(moved);
		},
		[occupant]
	);

	// Pick a doll up. Its dorm chibi is normally loaded and waiting, so the pick animation starts at once. Otherwise its combat chibi
	// follows the pointer until the dorm chibi lands.
	const pickUp = useCallback(
		(dollId: number, fromCell: number, x: number, y: number) => {
			const entry = actorsRef.current.get(dollId);
			if (!entry) {
				return;
			}
			const held: HeldDoll = { dollId, fromCell, x, y };
			droppedRef.current = new Set();
			heldRef.current = held;
			entry.actor.setOnTop(true);
			entry.actor.setPosition(x, y);
			const over = cellAtSide(geometry, x, y, "player");
			overRef.current = over;
			setDrag({ from: fromCell, over });
			onDragPreview(over === null ? null : { from: fromCell, over });
			if (entry.dorm) {
				showDorm(entry, held);
			} else if (entry.dormState === "missing") {
				loadDorm(dollId, entry);
			}
		},
		[geometry, loadDorm, onDragPreview, showDorm]
	);

	// Put a held doll down. It stands on the tile it was dropped on, or back on its own tile when the drop missed the grid.
	const putDown = useCallback(
		(dropCell: number | null) => {
			const held = heldRef.current;
			if (!held) {
				return;
			}
			heldRef.current = null;
			overRef.current = null;
			setDrag(null);
			onDragPreview(null);
			const entry = actorsRef.current.get(held.dollId);
			// The dorm chibi is kept for the next pick-up rather than freed, since the doll is still on the grid.
			entry?.dorm?.setVisible(false);
			entry?.actor.setVisible(true);
			entry?.actor.setOnTop(false);
			if (dropCell !== null && dropCell !== held.fromCell) {
				markDropped(held.fromCell, dropCell);
				onMove(held.fromCell, dropCell);
			} else if (entry) {
				const home = tileCentre(geometry, entry.cell, "player");
				entry.actor.setPosition(home.x, home.y);
			}
		},
		[geometry, markDropped, onDragPreview, onMove]
	);

	// Pick an enemy up. Its rig carries the pick animation itself when it has one, so unlike a doll there is no second chibi to load.
	const pickUpEnemy = useCallback((cell: number, x: number, y: number) => {
		const entry = enemyActorsRef.current.get(cell);
		if (!entry) {
			return;
		}
		heldEnemyRef.current = { fromCell: cell, x, y };
		entry.actor.setOnTop(true);
		entry.actor.setPosition(x, y);
		entry.actor.play(entry.actor.animations.includes(HELD_ANIM) ? HELD_ANIM : IDLE_ANIM);
		enemyOverRef.current = cell;
		setEnemyOver(cell);
	}, []);

	const putDownEnemy = useCallback(
		(dropCell: number | null) => {
			const held = heldEnemyRef.current;
			if (!held) {
				return;
			}
			heldEnemyRef.current = null;
			enemyOverRef.current = null;
			setEnemyOver(null);
			const entry = enemyActorsRef.current.get(held.fromCell);
			entry?.actor.setOnTop(false);
			entry?.actor.play(IDLE_ANIM);
			if (dropCell !== null && dropCell !== held.fromCell) {
				onEnemyMove(held.fromCell, dropCell);
			} else if (entry) {
				const home = tileCentre(geometry, entry.cell, "enemy");
				entry.actor.setPosition(home.x, home.y);
			}
		},
		[geometry, onEnemyMove]
	);

	const handlePointerMove = useCallback(
		(event: PointerEvent<SVGSVGElement>) => {
			const press = pressRef.current;
			if (!press) {
				return;
			}
			const { x, y } = pointAt(event);
			const heldEnemy = heldEnemyRef.current;
			if (heldEnemy) {
				heldEnemy.x = x;
				heldEnemy.y = y;
				enemyActorsRef.current.get(heldEnemy.fromCell)?.actor.setPosition(x, y);
				const over = cellAtSide(geometry, x, y, "enemy");
				if (enemyOverRef.current !== over) {
					enemyOverRef.current = over;
					setEnemyOver(over);
				}
				return;
			}
			const held = heldRef.current;
			if (held) {
				held.x = x;
				held.y = y;
				const entry = actorsRef.current.get(held.dollId);
				(entry?.dorm ?? entry?.actor)?.setPosition(x, y);
				const over = cellAtSide(geometry, x, y, "player");
				if (overRef.current !== over) {
					overRef.current = over;
					setDrag((current) => (current ? { ...current, over } : current));
					onDragPreview(over === null ? null : { from: held.fromCell, over });
				}
				return;
			}
			if (!canDrag || moveFrom !== null || Math.hypot(x - press.x, y - press.y) <= DRAG_THRESHOLD) {
				return;
			}
			// An enemy is dragged only within its own grid, the same way a doll is dragged within the echelon's.
			if (press.hit?.side === "enemy" && enemyActorsRef.current.has(press.hit.cell)) {
				// Captured so the drop still arrives when the pointer leaves the stage.
				event.currentTarget.setPointerCapture(event.pointerId);
				pickUpEnemy(press.hit.cell, x, y);
				return;
			}
			const standing = press.hit?.side === "player" ? occupant.get(press.hit.cell) : undefined;
			if (!standing) {
				return;
			}
			event.currentTarget.setPointerCapture(event.pointerId);
			pickUp(standing.setup.dollId, standing.setup.cell, x, y);
		},
		[canDrag, geometry, moveFrom, occupant, onDragPreview, pickUp, pickUpEnemy, pointAt]
	);

	// A capture lost without a pointerup, such as a cancelled touch, puts the doll back.
	const handleLostCapture = useCallback(() => {
		pressRef.current = null;
		putDown(null);
		putDownEnemy(null);
	}, [putDown, putDownEnemy]);

	const handlePointerUp = useCallback(
		(event: PointerEvent<SVGSVGElement>) => {
			const press = pressRef.current;
			pressRef.current = null;
			const { x, y } = pointAt(event);
			const hit = cellAt(geometry, x, y);
			// Only the echelon's own grid takes a doll, so a release anywhere else puts a held doll back.
			const cell = hit?.side === "player" ? hit.cell : null;
			if (heldEnemyRef.current) {
				putDownEnemy(hit?.side === "enemy" ? hit.cell : null);
				return;
			}
			if (heldRef.current) {
				putDown(cell);
				return;
			}
			if (!press) {
				return;
			}
			const dragged = Math.hypot(x - press.x, y - press.y) > DRAG_THRESHOLD;
			if (moveFrom !== null) {
				// Tap-to-move only takes a plain click. A click on a different tile moves there, and one on the doll's own tile or off the grid cancels.
				if (!dragged) {
					if (cell === null || cell === moveFrom) {
						onCancelMove();
					} else {
						onMove(moveFrom, cell);
					}
				}
				return;
			}
			// A plain click that began and ended on the same tile of the other grid opens its picker, which is all that side takes.
			if (!dragged && hit?.side === "enemy") {
				if (press.hit?.side === "enemy" && press.hit.cell === hit.cell) {
					onEnemyTileClick(hit.cell);
				}
				return;
			}
			const from = press.hit?.side === "player" ? press.hit.cell : null;
			if (from === null || cell === null) {
				return;
			}
			if (dragged && from !== cell && occupant.has(from)) {
				// A drag whose chibi had not loaded when it started never picked the doll up, but it is still a drop.
				markDropped(from, cell);
				onMove(from, cell);
			} else if (!dragged) {
				onTileClick(cell);
			}
		},
		[geometry, markDropped, moveFrom, occupant, onCancelMove, onEnemyTileClick, onMove, onTileClick, pointAt, putDown, putDownEnemy]
	);

	const fontSize = Math.max(LABEL_MIN_FONT, geometry.tileWidth * LABEL_FONT_SHARE);
	const fontFamily = theme.typography.fontFamily ?? "sans-serif";

	return (
		<Box ref={wrapperRef} sx={{ position: "relative", width: "100%", height: geometry.height, userSelect: "none" }}>
			<svg width={geometry.width} height={geometry.height} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
				{Array.from({ length: GRID_CELLS }, (_, cell) => {
					const lit = reach.has(cell);
					const outlined = cell === selectedCell || cell === moveFrom || cell === focus?.cell;
					return (
						<polygon
							key={cell}
							points={tilePoints(geometry, cell, "player")}
							fill={lit ? theme.palette.tile.buff : theme.palette.tile.empty}
							fillOpacity={lit ? REACH_OPACITY : 1}
							stroke={outlined ? theme.palette.primary.main : theme.palette.tile.line}
							strokeWidth={outlined ? 3 : 1.5}
						/>
					);
				})}
				{/* The opposing grid. Drawn in the error colour so the two sides read apart at a glance, and with no tile buffs of its
				    own, since an enemy squad has no formation effects to show. */}
				{Array.from({ length: GRID_CELLS }, (_, cell) => {
					const taken = enemyCells.has(cell);
					// The tile a dragged enemy would land on.
					const outlined = cell === enemyOver;
					return (
						<polygon
							key={`enemy-${cell}`}
							points={tilePoints(geometry, cell, "enemy")}
							fill={taken ? theme.palette.error.dark : theme.palette.tile.empty}
							fillOpacity={taken ? 0.28 : 1}
							stroke={outlined ? theme.palette.error.main : theme.palette.tile.line}
							strokeWidth={outlined ? 3 : 1.5}
						/>
					);
				})}
			</svg>
			<Box ref={canvasHostRef} sx={{ position: "absolute", inset: 0, pointerEvents: "none", "& canvas": { display: "block" } }} />
			<svg
				width={geometry.width}
				height={geometry.height}
				style={{ position: "absolute", inset: 0, touchAction: "none", cursor: drag ? "grabbing" : moveFrom !== null ? "crosshair" : "pointer" }}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onLostPointerCapture={handleLostCapture}
				role="group"
				aria-label="Formation grid"
			>
				{Array.from({ length: GRID_CELLS }, (_, cell) => (
					<polygon
						key={cell}
						points={tilePoints(geometry, cell, "player")}
						fill="transparent"
						onPointerEnter={(event) => event.pointerType === "mouse" && setHoveredCell(cell)}
						onPointerLeave={() => setHoveredCell((current) => (current === cell ? null : current))}
					/>
				))}
				{Array.from({ length: GRID_CELLS }, (_, cell) => {
					const here = sources[cell] ?? [];
					const standing = occupant.get(cell);
					const shown = standing ? here.filter((source) => appliesTo(source, standing.form.type)) : here;
					const parts = showTotals ? labelParts(shown) : [];
					if (parts.length === 0) {
						return null;
					}
					const text = parts.reduce(
						(total, part, index) =>
							total +
							(index > 0 ? measureText(" · ", `${fontSize}px ${fontFamily}`) : 0) +
							measureText(`${part.name} `, `${fontSize * LABEL_NAME_SHARE}px ${fontFamily}`) +
							measureText(String(part.value), `700 ${fontSize}px ${fontFamily}`),
						0
					);
					const width = text + fontSize * LABEL_PILL_PADDING * 2;
					const { x, y } = tileCentre(geometry, cell, "player");
					// One line on the tile's front half, drawn over the chibis so a doll standing in front can never hide it.
					const pillTop = y + geometry.tileHeight * LABEL_TILE_OFFSET;
					return (
						<g key={cell} opacity={standing ? 1 : 0.85} pointerEvents="none">
							<rect
								x={x - width / 2}
								y={pillTop}
								width={width}
								height={fontSize * LABEL_PILL_HEIGHT}
								rx={fontSize * LABEL_PILL_HEIGHT * 0.5}
								fill={theme.palette.background.default}
								fillOpacity={0.85}
								stroke={theme.palette.tile.buff}
							/>
							<text x={x} y={pillTop + fontSize * 1.32} fontSize={fontSize} textAnchor="middle" fill={theme.palette.text.primary} style={{ whiteSpace: "pre" }}>
								{parts.map((part, index) => (
									<Fragment key={part.name}>
										{index > 0 && <tspan fillOpacity={LABEL_SEPARATOR_OPACITY}> · </tspan>}
										<tspan fontSize={fontSize * LABEL_NAME_SHARE} fillOpacity={LABEL_NAME_OPACITY}>
											{part.name}{" "}
										</tspan>
										<tspan fontWeight={700}>{part.value}</tspan>
									</Fragment>
								))}
							</text>
						</g>
					);
				})}
			</svg>
			{hoverCard && (
				<Box
					role="tooltip"
					sx={{
						position: "absolute",
						left: hoverCard.anchor.x,
						top: hoverCard.anchor.y - geometry.tileHeight / 2,
						transform: "translate(-50%, calc(-100% - 8px))",
						pointerEvents: "none",
						px: 1.25,
						py: 0.75,
						borderRadius: 1,
						border: 1,
						borderColor: "tile.buff",
						bgcolor: "background.default",
						whiteSpace: "nowrap",
						zIndex: 1
					}}
				>
					<Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
						{hoverCard.title}
					</Typography>
					{hoverCard.rows.length === 0 ? (
						<Typography variant="caption">No tile buffs</Typography>
					) : (
						hoverCard.rows.map((row, index) => (
							<Typography key={index} variant="caption" sx={{ display: "block", opacity: row.applies ? 1 : 0.5 }}>
								{row.text}
							</Typography>
						))
					)}
				</Box>
			)}
		</Box>
	);
});
