import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import ScrollToTopOnNavigate from "./components/ScrollToTopOnNavigate";

/** The path the site is served under, without its trailing slash, as the router's basename expects. */
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "");

// Links shared while the site used hash routes look like `/#/tdoll/280`. Move the route out of the hash before the
// router reads the URL, so those old links still open the right page.
if (window.location.hash.startsWith("#/")) {
	window.history.replaceState(null, "", `${BASENAME}${window.location.hash.slice(1)}`);
}

const container = document.getElementById("root");
if (!container) {
	throw new Error("index.html is missing the #root element");
}

createRoot(container).render(
	<Router basename={BASENAME}>
		<ScrollToTopOnNavigate>
			<App />
		</ScrollToTopOnNavigate>
	</Router>
);
