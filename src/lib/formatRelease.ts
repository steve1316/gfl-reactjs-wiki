import type { DollRelease } from "../types/tdoll";

/** English month abbreviations, fixed so the output never depends on the reader's locale. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/**
 * Turn a `YYYY-MM` prefix into a short month and year, such as `Sep 2024`.
 *
 * @param date A `YYYY-MM` or `YYYY-MM-DD` date.
 * @returns The month and year, or null when the month is not 1 to 12.
 */
function monthYear(date: string): string | null {
	const month = MONTHS[Number(date.slice(5, 7)) - 1];
	return month ? `${month} ${date.slice(0, 4)}` : null;
}

/**
 * Format a doll's Global release date at the precision it is known.
 *
 * @param release The doll's release date and precision.
 * @returns `25 Jul 2023` for a day, `Sep 2024` for a month, `Global launch (May 2018)` for the launch roster, and `Unknown` otherwise.
 */
export function formatRelease(release: DollRelease): string {
	const date = release.date;
	const shortMonth = date === null ? null : monthYear(date);
	if (date === null || shortMonth === null || release.precision === "unknown") {
		return "Unknown";
	}
	if (release.precision === "launch") {
		return `Global launch (${shortMonth})`;
	}
	if (release.precision === "month") {
		return shortMonth;
	}
	const day = Number(date.slice(8, 10));
	return day >= 1 && day <= 31 ? `${day} ${shortMonth}` : shortMonth;
}
