import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
	root: {
		marginTop: "4rem"
	}
});

/**
 * The catch-all page for unknown routes.
 *
 * @returns The 404 message.
 */
export default function NotFound404() {
	const classes = useStyles();

	return (
		<main>
			<div className={classes.root}>
				<h1 style={{ textAlign: "center" }}>404 Not Found</h1>
			</div>
		</main>
	);
}
