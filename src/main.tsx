import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";

import App from "./App";
import ScrollToTopOnNavigate from "./components/ScrollToTopOnNavigate";

// HashRouter keeps GitHub Pages from needing a 404 rewrite to serve client-side routes.
const container = document.getElementById("root");
if (!container) {
	throw new Error("index.html is missing the #root element");
}

createRoot(container).render(
	<Router>
		<ScrollToTopOnNavigate>
			<App />
		</ScrollToTopOnNavigate>
	</Router>
);
