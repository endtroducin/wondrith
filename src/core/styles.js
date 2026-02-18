// ======================================================
// 🎨 GLOBAL COLOR PALETTE
// ======================================================

export const COLORS = {
	ideas: "#90e0ef",
	tasks: "#f4a261",
	neutral: "#cccccc",

	debugPanelBg: "rgba(0, 0, 0, 0.85)",
	debugText: "#0f0",
};

// ======================================================
// 🃏 CARD VISUAL STYLE
// ======================================================
//
// Pure visual configuration.
// No logic.
// No appState references.
//

export const CARD_STYLE = {
	width: 200,
	height: 100,

	fill: COLORS.ideas,
	stroke: "#aaa",
	strokeWidth: 1,

	cornerRadius: 8,

	shadowBlur: 5,
	shadowOpacity: 0.15,
};

// ======================================================
// 🗺️ DEFAULT ZONE LAYOUT
// ======================================================
//
// These are logical world rectangles.
// They are used for:
// - zone detection
// - background drawing
// - camera anchoring
//

export const DEFAULT_ZONES = {
	ideaZone: {
		id: "ideaZone",
		x: 0,
		y: -10000,
		width: 10000,
		height: 10000,
		color: COLORS.ideas,
		label: "Ideas",
	},

	taskZone: {
		id: "taskZone",
		x: 0,
		y: 0,
		width: 10000,
		height: 10000,
		color: COLORS.tasks,
		label: "Tasks",
	},
};

// ======================================================
// 📐 GRID STYLE
// ======================================================
//
// Visual-only configuration for debug grid.
//

export const GRID_STYLE = {
	gridSize: 25,
	majorLine: 100,

	lightColor: "#0000001b",
	darkColor: "#00000039",

	strokeWidthMajor: 1,
	strokeWidthMinor: 0.5,

	labelColor: "#666",
	labelFontSize: 10,
};
