/**
 * Interim types for the hand-written equipment module.
 *
 * See the doll data declarations for why this exists. Equipment is keyed by category directory name,
 * which doubles as the path segment its icons live under.
 */
import type { RawEquipment } from "../types/equipment";

declare const equipments: Record<string, RawEquipment[]>;
export default equipments;
