import React from "react";
import { Route } from "react-router-dom";

// MaterialUI imports
import { orange, deepOrange } from "@material-ui/core/colors";

// Pages imports
import Home from "./pages/home/Home";
import TDoll_Index from "./pages/tdoll_index/TDoll_Index";

// styles.css import
import "./styles.css";

// Navbar import
import Navbar from "./components/Navbar";

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
			<Navbar />
			<div className="App">
				<Route exact path="/" component={Home} />
				<Route exact path="/index" component={TDoll_Index} />
			</div>
		</ThemeProvider>
	);
}
