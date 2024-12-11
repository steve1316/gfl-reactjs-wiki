import { lazy, Suspense } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import NotFound404 from "./not_found_404";
import EquipmentIndex from "./pages/equipment_index/equipment_index";
import FormationSimulator from "./pages/formation_simulator/formation_simulator";
import Home from "./pages/home/home";
import TDoll from "./pages/tdoll/tdoll";
import TDollArt from "./pages/tdoll_art/tdoll_art";
import TDollIndex from "./pages/tdoll_index/tdoll_index";

import { theme } from "./theme";

import "./styles.css";

/** The HOC pages load on first visit, since few readers open them and they would otherwise add ~4.5 KB gzip to every route. */
const HOCIndex = lazy(() => import("./pages/hoc_index/hoc_index"));
const HOCPage = lazy(() => import("./pages/hoc/hoc"));

/** The Fairy pages load on first visit, for the same reason as the HOC pages. */
const FairyIndex = lazy(() => import("./pages/fairy_index/fairy_index"));
const FairyPage = lazy(() => import("./pages/fairy/fairy"));

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
					<Route
						path="/hoc-index"
						element={
							<Suspense>
								<HOCIndex />
							</Suspense>
						}
					/>
					<Route
						path="/hoc/:id"
						element={
							<Suspense>
								<HOCPage />
							</Suspense>
						}
					/>
					<Route
						path="/fairy-index"
						element={
							<Suspense>
								<FairyIndex />
							</Suspense>
						}
					/>
					<Route
						path="/fairy/:id"
						element={
							<Suspense>
								<FairyPage />
							</Suspense>
						}
					/>
					<Route path="/formation" element={<FormationSimulator />} />
					<Route path="/tdoll/:id/art" element={<TDollArt />} />
					<Route path="/tdoll/:id" element={<TDoll />} />
					<Route path="/tdoll" element={<TDoll />} />
					<Route path="/404" element={<NotFound404 />} />
					{/* Anything unmatched shows the 404 page in place, keeping the mistyped address visible. */}
					<Route path="*" element={<NotFound404 />} />
				</Routes>
			</div>
		</ThemeProvider>
	);
}
