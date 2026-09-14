/**
 * Doll data shards, by id range. `file` holds the doll records the T-Doll index reads, and `profiles` holds the same dolls' profiles
 * and spec sheets, which only the doll page loads. `src/lib/data.ts` must list the same files in the same order.
 */
export const SHARDS = [
	{ file: "dolls-1-100", profiles: "profiles-1-100", min: 1, max: 100 },
	{ file: "dolls-101-200", profiles: "profiles-101-200", min: 101, max: 200 },
	{ file: "dolls-201-300", profiles: "profiles-201-300", min: 201, max: 300 },
	{ file: "dolls-301-400", profiles: "profiles-301-400", min: 301, max: 400 },
	{ file: "dolls-401-999", profiles: "profiles-401-999", min: 401, max: 999 },
	{ file: "dolls-1000-1999", profiles: "profiles-1000-1999", min: 1000, max: 1999 }
];
