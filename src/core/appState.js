export const appState = {
	stage: null, // Konva stage
	layer: null, // Main canvas layer

	// 🖼️ Canvas & Stage info (updated on resize)
	canvas: {
		height: null,
		width: null,
	},

	// 🃏 Cards stored by IDappstate.canvas.heightappstate.stage
	cards: {}, // Indexed by card _id

	debug: {
		enabled: true,
		panelVisible: true,
		hoveredCardId: null,
		expandedCardId: null,
	},

	mouse: {
		x: null,
		y: null,
	},

	zones: {},
};