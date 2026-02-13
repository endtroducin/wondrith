// 📍 src/core/appState.js
// 🧠 This is your single source of live app data.
// UI, renderers, and interactions all use this to know the current state.

export const appState = {
	stage: null, // Konva stage reference
	layer: null, // Main canvas layer
	cards: {}, // All cards, keyed by ID
	renderedCards: {},
	zones: {}, // Zone info if needed
	canvas: { x: 0, y: 0 },
	mouse: { x: 0, y: 0 }, // Mouse tracking
	debug: {
		enabled: true,
		panelVisible: true,
		hoveredCardId: null,
		activeCardId: null,
	},
};

// export const appState = {
// 	stage: null, // Konva stage
// 	layer: null, // Main canvas layer

// 	// 🖼️ Canvas & Stage info (updated on resize)
// 	canvas: {
// 		height: null,
// 		width: null,
// 	},

// 	// 🃏 Cards stored by IDappstate.canvas.heightappstate.stage
// 	cards: {}, // Indexed by card _id

// 	debug: {
// 		enabled: true,
// 		panelVisible: true,
// 		hoveredCardId: null,
// 		expandedCardId: null,
// 	},

// 	mouse: {
// 		x: null,
// 		y: null,
// 	},

// 	zones: {},
// };
