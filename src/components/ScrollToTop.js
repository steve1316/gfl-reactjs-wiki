/*
Source: https://github.com/codegeous/react-component-depot/blob/master/src/components/ScrollIndicator/index.js
*/
import React, { useState, useEffect } from "react";
import { useWindowScroll } from "react-use";

export default function ScrollToTop() {
	const { y: pageYOffset } = useWindowScroll();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (pageYOffset > 600) {
			setVisible(true);
		} else {
			setVisible(false);
		}
	}, [pageYOffset]);

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

	if (!visible) {
		return false;
	} else {
		return (
			<div className="scroll-to-top cursor-pointer" onClick={scrollToTop}>
				<i className="icon fas fa-chevron-up"></i>
			</div>
		);
	}
}
