import React from "react";
import { Link } from "react-router-dom";

// This ErrorBoundary will handle the case where user arrives in /tdoll without going through
// the T-Doll Index page or changes the "?id=" part of the URL to an invalid id.

// One thing to note: I store selected T-Doll's information into a JSON and store it into sessionStorage. If the user
// triggers this ErrorBoundary, the sessionStorage appears to be cleared. That is why I include a link back to the T-Doll Index
// to clear up any user confusion.
export default class ErrorBoundary extends React.Component {
	state = { hasError: false, error: null };

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Console log the error when this catches an error.
		console.log("Error encountered: ", error);
		console.log("Error info: ", errorInfo);
	}

	// Render the <h2> error message tag with a link to go back to the T-Doll Index or if no error,
	// render the children (the T-Doll's page) instead.
	render() {
		if (this.state.hasError) {
			//console.clear();
			return (
				<main style={{ marginTop: "5rem" }}>
					<h2 style={{ textAlign: "center" }}>
						404 T-Doll Not Found! Please go to the{" "}
						<Link to="/index" style={{ color: "cyan" }}>
							T-Doll Index
						</Link>{" "}
						Page and try again.
					</h2>
				</main>
			);
		}

		return this.props.children;
	}
}
