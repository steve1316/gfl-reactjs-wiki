/*
Source: https://github.com/codegeous/react-component-depot/blob/master/src/components/ScrollIndicator/index.js
*/
import { useEffect, useState } from "react";

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
	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > REVEAL_AFTER_PX);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	if (!visible) {
		return null;
	}

	return (
		<div className="scroll-to-top cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
			<i className="icon fas fa-chevron-up"></i>
		</div>
	);
}
