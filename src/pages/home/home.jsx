import React, { useState, useEffect } from "react";

// Component imports
import Navbar from "../../components/navbar";

// MaterialUI imports
import { Button } from "@material-ui/core";

function Home() {
	return (
		<div>
			<Navbar />
			<h1>Header</h1>
			<p>Hello</p>
			<Button color="primary" variant="contained">
				Hello World
			</Button>
		</div>
	);
}
export default Home;
