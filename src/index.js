import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import ScrollToTop from "react-router-scroll-top";

// HashRouter is needed for GitHub Pages to properly route users.
import { HashRouter as Router } from "react-router-dom";

ReactDOM.render(
	<Router>
		<ScrollToTop>
			<App />
		</ScrollToTop>
	</Router>,
	document.getElementById("root")
);
