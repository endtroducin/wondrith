// src/appState.js

export const appState = {
	stage: null, // Konva stage
	layer: null, // Main canvas layer

	cards: {}, // Indexed by card _id

	cardStyle: {
		width: 160,
		height: 100,
		fill: "#90e0ef",
		cornerRadius: 8,
		shadowBlur: 5,
		shadowOpacity: 0.2,
		stroke: "#aaa",
		strokeWidth: 1,
	},

	debug: {
		enabled: true,
		panelVisible: true,
		hoveredCardId: null,
	},
};

// // 🧠 Global App State
// // This object stores references and variables shared across your app
// export const appState = {
// 	stage: null, // Will hold the Konva stage after it's created
// 	layer: null, // Will hold the main drawing layer

// 	debug: {
// 		enabled: true,
// 		panelVisible: true, // 🆕 used to toggle panel
// 	},

// 	// 🃏 Card Definition (Single card for now)
// 	cards: {}, // 🆕 store cards by ID

// 	activeDragCardId: null, // 🆕 Track currently dragged card ID (or null)

// 	cardStyle: {
// 		width: 160,
// 		height: 100,
// 		fill: "#90e0ef",
// 		cornerRadius: 8,
// 		shadowBlur: 5,
// 		shadowOpacity: 0.2,
// 		stroke: "#aaa",
// 		strokeWidth: 1,
// 	},
// };

// -----------------------------------

// // 🔁 Global application state (aka single source of truth)

// export const appState = {
// 	// 🧭 Camera controls the view (panning, zoom)
// 	camera: {
// 		x: 0, // Canvas pan X
// 		y: 0, // Canvas pan Y
// 		scale: 1, // Zoom level
// 	},

// 	// 🐭 Mouse tracking (both screen + world coordinates)
// 	mouse: {
// 		x: 0, // Mouse X on screen
// 		y: 0, // Mouse Y on screen
// 		worldX: 0, // Mouse X in world space (after pan/zoom)
// 		worldY: 0, // Mouse Y in world space
// 	},

// 	// 🟪 Grid styling and structure
// 	grid: {
// 		size: 25, // Size between grid lines (pixels)
// 		majorStep: 100, // Frequency of bold lines
// 		colors: {
// 			minor: "#eee",
// 			major: "#aaa",
// 			axis: "#000",
// 		},
// 		widths: {
// 			minor: 0.5,
// 			major: 1,
// 			axis: 1.5,
// 		},
// 	},

// 	// 🃏 Default card size + styling
// 	card: {
// 		width: 160,
// 		height: 100,
// 		style: {
// 			fill: "#90e0ef",
// 			cornerRadius: 8,
// 			stroke: "#aaa",
// 			strokeWidth: 1,
// 			shadowBlur: 5,
// 			shadowOpacity: 0.15,
// 		},
// 	},

// 	// 🐞 Debug panel config
// 	debug: {
// 		enabled: true,
// 		vars: {}, // Optional dynamic debug vars
// 	},

// 	// 📐 Canvas + layers (assigned after init)
// 	canvas: {
// 		stage: null, // Konva stage object
// 		gridLayer: null, // Layer for grid lines
// 		mainLayer: null, // Layer for cards/zones/etc
// 		width: window.innerWidth,
// 		height: window.innerHeight,
// 	},
// };
