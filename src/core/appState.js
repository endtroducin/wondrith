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
	camera: {
		// Current camera offset (where the stage is visually positioned)
		position: { x: 0, y: 0 },

		// Current zoom level
		zoom: 1,

		// Viewport size (in pixels)
		viewport: {
			width: window.innerWidth,
			height: window.innerHeight,
		},

		// Calculated camera bounds — will update after camera moves
		bounds: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		},
	},
};
