// 📍 src/core/styles.js
// 🎨 Central source of visual styles for cards (used by renderers)

export const CARD_STYLE = {
	width: 160,
	height: 100,
	fill: "#90e0ef", // Light blue background
	cornerRadius: 8, // Slight rounding
	stroke: "#aaa", // Border color
	strokeWidth: 1, // Border thickness
	shadowBlur: 5,
	shadowOpacity: 0.15,
};

// // core/constants.js

// // 🎨 Color palette
export const COLORS = {
	ideas: "#90e0ef",
	tasks: "#f4a261",
	neutral: "#ccc",
	debugPanelBg: "rgba(0, 0, 0, 0.8)",
	debugText: "#0f0",
};

// // 🧱 Card visual style (shared by all cards)
// export const CARD_STYLE = {
// 	width: 160,
// 	height: 100,
// 	fill: COLORS.neutral,
// 	cornerRadius: 8,
// 	shadowBlur: 5,
// 	shadowOpacity: 0.2,
// 	stroke: "#aaa",
// 	strokeWidth: 1,
// };

// // 📦 Zone layout presets (you can use these to generate `appState.zones`)
export const DEFAULT_ZONES = {
	ideaZone: {
		id: "ideaZone",
		x: 50,
		y: 50,
		width: 400,
		height: 600,
		color: COLORS.ideas,
		label: "Ideas",
	},
	taskZone: {
		id: "taskZone",
		x: 500,
		y: 50,
		width: 400,
		height: 600,
		color: COLORS.tasks,
		label: "Tasks",
	},
};

// 📁 src/core/styles.js

export const GRID_STYLE = {
	spacingSmall: 25,
	spacingLarge: 100,
	lightColor: "#0000001b",
	darkColor: "#00000039",
	strokeWidthMajor: 1,
	strokeWidthMinor: 0.5,
	labelColor: "#666",
	labelFontSize: 10,
};

// // Style of card when dragged
// export const CARD_LIFTED_STYLE = {
// 	scale: { x: 1.1, y: 1.1 },
// 	shadowBlur: 15,
// 	shadowOffset: { x: 5, y: 5 },
// 	shadowOpacity: 0.4,
// };

// // Default style
// export const CARD_DEFAULT_STYLE = {
// 	scale: { x: 1, y: 1 },
// 	shadowBlur: 5,
// 	shadowOffset: { x: 2, y: 2 },
// 	shadowOpacity: 0.2,
// };
