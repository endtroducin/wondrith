// 📍 src/core/appState.js
// ======================================================
// 🧠 SINGLE SOURCE OF TRUTH
// ======================================================
//
// All dynamic runtime data lives here.
//
// Rules:
//  - Nothing outside this file defines state.
//  - Other files may READ and WRITE.
//  - Constants belong in styles.js or schemas.js.
//  - This file contains NO logic.
//

export const appState = {
	// ==================================================
	// 🎛️ KONVA REFERENCES
	// ==================================================
	stage: null,

	layers: {
		world: null,
		ui: null,
	},

	world: {
		group: null, // camera transform container
	},

	// ==================================================
	// 📦 DATA
	// ==================================================
	cards: {},
	renderedCards: {},
	zones: {},

	// ==================================================
	// 🖱️ INPUT STATE
	// ==================================================
	mouse: { x: 0, y: 0 },

	debug: {
		enabled: true,
		panelVisible: true,
		hoveredCardId: null,
		activeCardId: null,
	},

	// ==================================================
	// 🌍 WORLD MODEL
	// ==================================================

	world: {
		group: null, // Konva.Group that holds everything in world space
		focalLength: 1000, // Controls depth perspective intensity
	},

	// ==================================================
	// 🎥 CAMERA STATE (2.5D ENGINE)
	// ==================================================

	camera: {
		// Ground-plane world coords (what point is at the top-left of viewport)
		x: 0,
		y: 0,

		// --------------------------------------------------
		// 🔍 Viewport Zoom (UI Scaling)
		// --------------------------------------------------

		// Zoom is still useful (fit-to-screen, user scroll later)
		zoom: 1,

		// --------------------------------------------------
		// 🏔 Conceptual Camera Height (Altitude)
		// Higher = farther away
		// Lower = closer to world
		// --------------------------------------------------

		// Camera "height" controls perspective strength
		// Higher height = flatter perspective
		height: 100,

		// --------------------------------------------------
		// 📐 Perspective Strength
		// Larger = flatter perspective
		// Smaller = more dramatic perspective
		// --------------------------------------------------

		// Optional: focalLength hook (leave for later)
		// focalLength: 100,

		// --------------------------------------------------
		// 🧭 Active Zone
		// --------------------------------------------------

		activeZone: "plan",

		// --------------------------------------------------
		// 📊 Debug Bounds
		// --------------------------------------------------

		bounds: { top: 0, right: 0, bottom: 0, left: 0 },
	},

	// ==================================================
	// 🖼️ VIEWPORT SIZE
	// ==================================================
	canvas: { width: 0, height: 0 },
};
