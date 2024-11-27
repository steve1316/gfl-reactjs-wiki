import { useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";

/** How far before the section reaches the viewport its children are mounted, in CSS pixels. */
const ROOT_MARGIN = "300px";

/** Props for LazySection. */
interface LazySectionProps {
	/** Height the placeholder reserves before the children mount, so the page does not jump. */
	minHeight: number;
	/** The content to mount once the section is close to the viewport. */
	children: React.ReactNode;
}

/**
 * Mounts its children only once they are scrolled near.
 *
 * The doll page shows every section at once now, and the chibi is the one section whose mount costs a
 * network round trip: the Spine skeleton, its atlas and the atlas page images. Mounting it eagerly would
 * make every doll page visit pay for an animation most readers never scroll to. Once mounted it stays
 * mounted, so scrolling back and forth does not reload the skeleton.
 *
 * @param props Component props.
 * @returns The children once near the viewport, or a placeholder of the reserved height until then.
 */
export default function LazySection({ minHeight, children }: LazySectionProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		const element = ref.current;
		// No IntersectionObserver means no way to tell, so show the content rather than hide it forever.
		if (!element || typeof IntersectionObserver === "undefined") {
			setShown(true);
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setShown(true);
					observer.disconnect();
				}
			},
			{ rootMargin: ROOT_MARGIN }
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return <Box ref={ref}>{shown ? children : <Box sx={{ minHeight }} />}</Box>;
}
