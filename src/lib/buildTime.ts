/** A build time the reader typed, read into seconds. */
export interface BuildTimeQuery {
	/** The typed time in seconds. */
	seconds: number;
	/** `minute` when only hours and minutes were typed, so any second within that minute matches. */
	precision: "minute" | "second";
}

/**
 * Format a build time the way the game's timer shows it.
 *
 * @param seconds Build time in seconds.
 * @returns The time as `H:MM:SS`, such as `3:55:00`.
 */
export function formatBuildTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * Format a typed build time for a filter chip, keeping the precision the reader typed.
 *
 * @param query The parsed query.
 * @returns `H:MM` for a minute query, `H:MM:SS` for a second query.
 */
export function formatBuildTimeQuery(query: BuildTimeQuery): string {
	const full = formatBuildTime(query.seconds);
	return query.precision === "minute" ? full.slice(0, -3) : full;
}

/**
 * Read a typed build time: `3:55`, `03:55`, `3:55:00`, `355`, `0355` or `035500`.
 *
 * @param input What the reader typed.
 * @returns The time and its precision, or null when the input is empty or not a build time.
 */
export function parseBuildTime(input: string): BuildTimeQuery | null {
	const text = input.trim();
	let parts: number[];
	if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(text)) {
		parts = text.split(":").map(Number);
	} else if (/^\d{3,4}$/.test(text)) {
		parts = [Number(text.slice(0, -2)), Number(text.slice(-2))];
	} else if (/^\d{6}$/.test(text)) {
		parts = [Number(text.slice(0, 2)), Number(text.slice(2, 4)), Number(text.slice(4))];
	} else {
		return null;
	}
	const [hours = 0, minutes = 0, seconds] = parts;
	if (minutes > 59 || (seconds ?? 0) > 59) {
		return null;
	}
	return { seconds: hours * 3600 + minutes * 60 + (seconds ?? 0), precision: seconds === undefined ? "minute" : "second" };
}

/**
 * Whether a build time matches a typed query. A minute query matches every second of that minute.
 *
 * @param seconds The build time in seconds.
 * @param query The parsed query.
 * @returns True when the build time matches.
 */
export function matchesBuildTime(seconds: number, query: BuildTimeQuery): boolean {
	return query.precision === "second" ? seconds === query.seconds : Math.floor(seconds / 60) === Math.floor(query.seconds / 60);
}
