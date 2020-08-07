import React from "react";
import { Route } from "react-router-dom";

// Import Pages
import Home from "./pages/home/home";

function App() {
	return (
		<div>
			<Route exact path="/" component={Home} />
		</div>
	);
}

export default App;
