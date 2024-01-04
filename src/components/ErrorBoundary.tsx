import React from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

/** Props for ErrorBoundary. */
interface ErrorBoundaryProps {
	/** The subtree to guard. */
	children: ReactNode;
}

/** State for ErrorBoundary. */
interface ErrorBoundaryState {
	/** Whether a descendant has thrown. */
	hasError: boolean;
	/** The error that was caught, kept for logging. */
	error: Error | null;
}

/**
 * Catches the case where a reader lands on a doll page with an id that does not exist.
 *
 * The selected doll is cached in `sessionStorage`, and that cache appears empty when this triggers,
 * so the fallback links back to the index rather than leaving the reader stuck.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { hasError: false, error: null };

	/**
	 * Move the component into its error state.
	 *
	 * @param error The error a descendant threw.
	 * @returns The next state.
	 */
	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	/**
	 * Log what was caught.
	 *
	 * @param error The error a descendant threw.
	 * @param errorInfo React's component stack for the error.
	 */
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.log("ErrorBoundary - error: ", error);
		console.log("ErrorBoundary - error info: ", errorInfo);
	}

	/**
	 * @returns The fallback message when a descendant threw, otherwise the children.
	 */
	render() {
		if (this.state.hasError) {
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
