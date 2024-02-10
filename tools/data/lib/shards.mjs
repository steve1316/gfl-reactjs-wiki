/** Doll data shards, by id range. `data.ts` must list the same files in the same order. */
export const SHARDS = [
	{ file: "dolls-1-100", min: 1, max: 100 },
	{ file: "dolls-101-200", min: 101, max: 200 },
	{ file: "dolls-201-300", min: 201, max: 300 },
	{ file: "dolls-301-400", min: 301, max: 400 },
	{ file: "dolls-401-999", min: 401, max: 999 },
	{ file: "dolls-1000-1999", min: 1000, max: 1999 }
];
