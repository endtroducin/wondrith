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
	// 🎬 KONVA REFERENCES
	// ==================================================

	stage: null, // Konva Stage reference

	layers: {
		background: null, // Zones + grid
		world: null, // Cards + world elements
		ui: null, // Debug panel, overlays
	},

	// ==================================================
	// 🃏 CARD SYSTEM
	// ==================================================

	cards: {}, // Card data by ID
	renderedCards: {}, // Konva Group references by ID

	// ==================================================
	// 🗺️ ZONES
	// ==================================================

	zones: {}, // Zone definitions (rectangles)

	// ==================================================
	// 🖥️ CANVAS / VIEWPORT
	// ==================================================

	canvas: {
		width: 0,
		height: 0,
	},

	// ==================================================
	// 🖱️ MOUSE TRACKING
	// ==================================================

	mouse: {
		x: 0,
		y: 0,
	},

	// ==================================================
	// 🐞 DEBUG STATE
	// ==================================================

	debug: {
		enabled: true,
		panelVisible: true,
		hoveredCardId: null,
		activeCardId: null,
	},

	// ==================================================
	// 🎥 CAMERA STATE
	// ==================================================

	camera: {
		// Logical target
		activeZone: "plan", // "idea" | "plan" | "task"

		zoom: 1,

		// Calculated visible world bounds
		bounds: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		},
	},
};
