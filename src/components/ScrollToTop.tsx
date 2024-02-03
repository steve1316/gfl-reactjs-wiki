/*
Source: https://github.com/codegeous/react-component-depot/blob/master/src/components/ScrollIndicator/index.js
*/
import { useCallback, useEffect, useState } from "react";
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

/** Scroll distance in pixels before the button appears. */
const REVEAL_AFTER_PX = 600;

/**
 * A button that returns the reader to the top of a long page.
 *
 * Despite the name it is unrelated to `ScrollToTopOnNavigate`, which handles route changes.
 *
 * @returns The button once the page is scrolled far enough, otherwise nothing.
 */
export default function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	// This was `useWindowScroll` from react-use, a whole dependency for one hook that had not been
	// released for React 19. Listening directly is shorter and only re-renders when the button flips.
	const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > REVEAL_AFTER_PX);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<Zoom in={visible}>
			<Fab size="small" color="primary" aria-label="scroll back to top" onClick={scrollToTop} sx={{ position: "fixed", bottom: 16, right: 16, zIndex: (theme) => theme.zIndex.appBar - 1 }}>
				<KeyboardArrowUpIcon />
			</Fab>
		</Zoom>
	);
}
