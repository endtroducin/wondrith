//#region Card Styles

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

//#endregion

// // 🎨 Color palette
export const COLORS = {
	ideas: "#90e0ef",
	tasks: "#f4a261",
	neutral: "#ccc",
	debugPanelBg: "rgba(0, 0, 0, 0.8)",
	debugText: "#0f0",
};

// // 📦 Zone layout presets (you can use these to generate `appState.zones`)
export const DEFAULT_ZONES = {
	ideaZone: {
		id: "ideaZone",
		x: 0,
		y: -10000, // conceptually infinite upward
		width: 10000,
		height: 10000,
		color: COLORS.ideas,
		label: "Ideas",
	},

	taskZone: {
		id: "taskZone",
		x: 0,
		y: 0, // starts at planning line
		width: 10000,
		height: 10000,
		color: COLORS.tasks,
		label: "Tasks",
	},
};

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

const CAMERA_PRESETS = {
	idea: {
		worldAnchorY: () => appState.zones.ideaZone.y + appState.zones.ideaZone.height,
		screenAnchorY: () => appState.canvas.height,
	},

	plan: {
		worldAnchorY: () => 0,
		screenAnchorY: () => appState.canvas.height / 2,
	},

	task: {
		worldAnchorY: () => appState.zones.taskZone.y,
		screenAnchorY: () => 0,
	},
};
