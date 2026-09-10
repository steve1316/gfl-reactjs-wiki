/**
 * Interim types for a hand-written data module.
 *
 * The module is still plain JavaScript, so this declaration is what gives consumers real types
 * without converting 19,000 lines that Phase 4 replaces with generated output. TypeScript resolves
 * this ahead of the sibling `.js`.
 */
import type { RawTDoll } from "../types/tdoll";

declare const tdolls: RawTDoll[];
export default tdolls;
