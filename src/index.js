import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// HashRouter is needed for GitHub Pages to properly route users.
import { HashRouter as Router } from "react-router-dom";

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById("root")
);
