import { CssBaseline, ThemeProvider, createMuiTheme } from "@material-ui/core";
import { deepOrange, orange } from "@material-ui/core/colors";
import { Redirect, Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar";
import NotFound404 from "./not_found_404";
import EquipmentIndex from "./pages/equipment_index/equipment_index";
import FairyIndex from "./pages/fairy_index/fairy_index";
import FormationSimulator from "./pages/formation_simulator/formation_simulator";
import HOCIndex from "./pages/hoc_index/hoc_index";
import Home from "./pages/home/home";
import TDoll from "./pages/tdoll/tdoll";
import TDollIndex from "./pages/tdoll_index/tdoll_index";

import "./styles.css";

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

/**
 * The application shell: theme, navigation and routes.
 *
 * @returns The routed application.
 */
export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Navbar />
			<div className="App">
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/index" component={TDollIndex} />
					<Route path="/equipment-index" component={EquipmentIndex} />
					<Route path="/hoc-index" component={HOCIndex} />
					<Route path="/fairy-index" component={FairyIndex} />
					<Route path="/formation" component={FormationSimulator} />
					<Route path="/tdoll/:id" component={TDoll} />
					<Route path="/tdoll" component={TDoll} />
					<Route path="/404" component={NotFound404} />
					<Redirect to="/404" />
				</Switch>
			</div>
		</ThemeProvider>
	);
}
