import React from "react";
import { Route, Switch } from "react-router-dom";
import { spring, AnimatedSwitch } from "react-router-transition";

// MaterialUI imports
import { orange, deepOrange } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";

// Pages imports
import Home from "./pages/home/Home";
import TDoll_Index from "./pages/tdoll_index/TDoll_Index";
import TDoll from "./pages/tdoll/TDoll";
import Equipment_Index from "./pages/equipment_index/Equipment_Index";
import HOC_Index from "./pages/hoc_index/HOC_Index";
import Fairy_Index from "./pages/fairy_index/Fairy_Index";
import Formation_Simulator from "./pages/formation_simulator/Formation_Simulator";

// styles.css import
import "./styles.css";

// Components import
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";

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

	// we need to map the `scale` prop we define below
	// to the transform style property
	function mapStyles(styles) {
		return {
			opacity: styles.opacity,
			transform: `scale(${styles.scale})`
		};
	}

	// wrap the `spring` helper to use a bouncy config
	function bounce(val) {
		return spring(val, {
			stiffness: 100,
			damping: 15
		});
	}

	// child matches will...
	const bounceTransition = {
		// start in a transparent, upscaled state
		atEnter: {
			opacity: 0,
			scale: 0.5
		},
		// leave in a transparent, downscaled state
		atLeave: {
			opacity: bounce(0),
			scale: bounce(2)
		},
		// and rest at an opaque, normally-scaled state
		atActive: {
			opacity: bounce(1),
			scale: bounce(1)
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Navbar />
			<div className="App">
				{/* Switch is needed to make sure that the error from ErrorBoundary does not propagate up the component tree. */}
				<AnimatedSwitch atEnter={bounceTransition.atEnter} atLeave={bounceTransition.atLeave} atActive={bounceTransition.atActive} mapStyles={mapStyles} className="route-wrapper">
					<Route exact path="/" component={Home} />
					<Route path="/reload" component={null} />
					<Route path="/index" component={TDoll_Index} />
					<Route path="/equipment-index" component={Equipment_Index} />
					<Route path="/hoc-index" component={HOC_Index} />
					<Route path="/fairy-index" component={Fairy_Index} />
					<Route path="/formation" component={Formation_Simulator} />
					<ErrorBoundary>
						<Route path="/tdoll" component={TDoll} />
					</ErrorBoundary>
				</AnimatedSwitch>
			</div>
		</ThemeProvider>
	);
}
