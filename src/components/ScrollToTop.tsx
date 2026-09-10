/*
Source: https://github.com/codegeous/react-component-depot/blob/master/src/components/ScrollIndicator/index.js
*/
import { useEffect, useState } from "react";
import { useWindowScroll } from "react-use";

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
	const { y: pageYOffset } = useWindowScroll();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(pageYOffset > REVEAL_AFTER_PX);
	}, [pageYOffset]);

	if (!visible) {
		return null;
	}

	return (
		<div className="scroll-to-top cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
			<i className="icon fas fa-chevron-up"></i>
		</div>
	);
}
