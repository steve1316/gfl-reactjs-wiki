import React from "react";
import { Route, Switch } from "react-router-dom";

// MaterialUI imports
import { orange, deepOrange } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";

// Pages imports
import Home from "./pages/home/Home";
import TDoll_Index from "./pages/tdoll_index/TDoll_Index";
import TDoll from "./pages/tdoll/TDoll";

// styles.css import
import "./styles.css";

// Components import
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundry";

// Theme Provider import
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

export default function App() {
	// Dark Theme colors
	const theme = createMuiTheme({
		palette: {
			type: "dark",
			primary: {
				main: orange[500]
			},
			secondary: {
				main: deepOrange[900]
			}
		}
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Navbar />
			<div className="App">
				{/* Switch is needed to make sure that the error from ErrorBoundary does not propagate up the component tree. */}
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/index" component={TDoll_Index} />
					<ErrorBoundary>
						<Route path="/tdoll" component={TDoll} />
					</ErrorBoundary>
				</Switch>
			</div>
		</ThemeProvider>
	);
}
