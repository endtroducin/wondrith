// ==================================================
// 📍 src/core/appState.js
// ==================================================
// 🧠 SINGLE SOURCE OF TRUTH
//
// Rules:
//   • World space is fixed
//   • Camera is state (x,y,zoom...)
//   • Renderers project world → screen
//
// This file contains NO logic.
// ==================================================

export const appState = {
	// ==================================================
	// 🎛️ KONVA REFERENCES
	// ==================================================
	stage: null,

	layers: {
		world: null,
	},

	// ==================================================
	// 🖼️ VIEWPORT SIZE (SYNCED FROM STAGE)
	// ==================================================
	canvas: {
		width: 0,
		height: 0,
	},

	// ==================================================
	// 🎥 CAMERA STATE (NOT FULLY USED UNTIL STEP 6/7)
	// ==================================================
	camera: {
		x: 0,
		y: 0,
		zoom: 1,

		// reserved for step 5+ (2.5D)
		height: 100,
		focalLength: 1000,
		activeZone: "plan",
		bounds: {},
	},

	// ==================================================
	// 📦 WORLD DATA
	// ==================================================
	cards: {},

	// ==================================================
	// 🎨 RENDERED NODE REFERENCES (PERSISTENT)
	// ==================================================
	rendered: {
		grid: {
			group: null,
		},
		cards: {
			// cardId -> Konva.Group
		},
	},
};
