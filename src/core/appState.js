// ==================================================
// 📍 src/core/appState.js
// ==================================================
// 🗄 APP STATE
//
// This is the SINGLE SOURCE OF TRUTH.
// All rendering and interactions read/write from here.
// ==================================================

import { config } from "../config.js";

/* ============================================================
   📦 INITIALIZE APP STATE
============================================================ */

export function initAppState() {
	// Define the center of the screen in world coordinates.
	const centerOffset = config.world.centerX;
	const heightOffset = config.world.centerY;

	// Create the camera object.
	// Position (x, y, z) represents the camera location in world space.
	// Looking straight down means we look along the negative Z axis.
	const camera = {
		x: centerOffset,
		y: heightOffset,
		z: config.camera.lookingDistance, // How far the camera is from the ground
	};

	// Define the viewport: where on screen the world center projects to.
	const viewport = {
		centerX: window.innerWidth / 2,
		centerY: window.innerHeight / 2,
		width: window.innerWidth,
		height: window.innerHeight,
	};

	// Define the conversion band boundaries.
	// These separate 'Ideas' (above) from 'Tasks' (below).
	const worldBoundaries = {
		conversionBandTop: 200, // Y coordinate above which clouds live
		conversionBandBottom: 200, // Y coordinate below which towers live
	};

	// Create the container for application state.
	const appState = {
		camera,
		viewport,
		world: {
			boundaries: worldBoundaries,
		},
		// Collections of objects will be populated by the renderer
		ideas: [],
		tasks: [],
	};

	return appState;
}

export const appState = initAppState();
