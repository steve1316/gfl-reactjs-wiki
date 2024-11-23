import { Box } from "@mui/material";

/** Style for the part of a name that matches the search. */
const matchSx = { fontWeight: 800, color: "text.primary" } as const;

/** Props for HighlightedName. */
interface HighlightedNameProps {
	/** The name as displayed. */
	name: string;
	/** Where the search matched inside the name, from `findNameMatch`, or null when nothing matched. */
	match: [number, number] | null;
}

/**
 * A name with the part a search matched shown in bold, shared by the doll and equipment cards.
 *
 * @param props Component props.
 * @returns The name, split around the match when there is one.
 */
export default function HighlightedName({ name, match }: HighlightedNameProps) {
	if (!match) {
		return <>{name}</>;
	}
	return (
		<>
			{name.slice(0, match[0])}
			<Box component="b" sx={matchSx}>
				{name.slice(match[0], match[1])}
			</Box>
			{name.slice(match[1])}
		</>
	);
}
