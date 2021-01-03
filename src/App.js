import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

// MaterialUI imports
import { orange, deepOrange } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";

// Pages imports
import Home from "./pages/home/home";
import TDoll_Index from "./pages/tdoll_index/tdoll_index";
import TDoll from "./pages/tdoll/tdoll";
import Equipment_Index from "./pages/equipment_index/equipment_index";
import HOC_Index from "./pages/hoc_index/hoc_index";
import Fairy_Index from "./pages/fairy_index/fairy_index";
import Formation_Simulator from "./pages/formation_simulator/formation_simulator";
import NotFound404 from "./not_found_404";

// styles.css import
import "./styles.css";

// Components import
import Navbar from "./components/Navbar";
//import ErrorBoundary from "./components/ErrorBoundary";

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
					<Route path="/reload" component={null} />
					<Route path="/index" component={TDoll_Index} />
					<Route path="/equipment-index" component={Equipment_Index} />
					<Route path="/hoc-index" component={HOC_Index} />
					<Route path="/fairy-index" component={Fairy_Index} />
					<Route path="/formation" component={Formation_Simulator} />
					{/* <ErrorBoundary> */}
					<Route path="/tdoll" component={TDoll} />
					{/* </ErrorBoundary> */}
					<Route path="/404" component={NotFound404} />
					<Redirect to="/404" />
				</Switch>
			</div>
		</ThemeProvider>
	);
}
