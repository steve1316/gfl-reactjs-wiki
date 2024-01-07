import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { deepOrange, orange } from "@mui/material/colors";
import { Navigate, Route, Routes } from "react-router-dom";

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

const theme = createTheme({
	palette: {
		mode: "dark",
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
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/index" element={<TDollIndex />} />
					<Route path="/equipment-index" element={<EquipmentIndex />} />
					<Route path="/hoc-index" element={<HOCIndex />} />
					<Route path="/fairy-index" element={<FairyIndex />} />
					<Route path="/formation" element={<FormationSimulator />} />
					<Route path="/tdoll/:id" element={<TDoll />} />
					<Route path="/tdoll" element={<TDoll />} />
					<Route path="/404" element={<NotFound404 />} />
					{/* Anything unmatched lands on the 404 page, which `Redirect` used to do in router v5. */}
					<Route path="*" element={<Navigate to="/404" replace />} />
				</Routes>
			</div>
		</ThemeProvider>
	);
}
