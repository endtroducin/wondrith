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
		activeZone: "planZone", // "ideaZone" | "planZone" | "taskZone"
		zoom: 1,

		// World anchor point
		anchorWorldY: 0,

		// Screen anchor position
		anchorScreenY: 0,

		// Calculated stage position
		position: { x: 0, y: 0 },

		bounds: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		},
	},
};
