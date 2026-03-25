// ==================================================
// 📍 src/constants/styles.js
// ==================================================
// 🎨 VISUAL CONSTANTS
//
// Static design values only.
// No runtime state belongs here.
// ==================================================

export const STYLES = {
	/* ============================================================
	   📐 GRID
	============================================================ */

	grid: {
		minorStep: 25,
		majorStep: 100,
		axisY: 0,

		colors: {
			minor: 0xe3e3e3,
			major: 0xc2c2c2,
			axis: 0x6f6f6f,
			label: 0x5a5a5a,
			labelBg: 0xf7f7f7,
		},

		widths: {
			minor: 1,
			major: 1.5,
			axis: 3,
		},
	},

	/* ============================================================
	   🏷️ LABELS
	============================================================ */

	labels: {
		fontFamily: "Arial",
		fontSize: 12,
		leftGutterWidth: 56,
		bottomGutterHeight: 28,
		leftPadding: 8,
		bottomPadding: 6,
	},

	/* ============================================================
	   🃏 CARD
	============================================================ */

	card: {
		shadowOffsetX: 6,
		shadowOffsetY: 8,

		colors: {
			idea: {
				top: 0xffffff,
				side: 0xe2e8f0,
				front: 0xf8fafc,
				stroke: 0x94a3b8,
				shadow: 0xdbeafe,
			},

			task: {
				top: 0xb0bec5,
				side: 0x78909c,
				front: 0x90a4ae,
				stroke: 0x546e7a,
				shadow: 0xcbd5e1,
			},

			transitioning: {
				top: 0xfffbeb,
				side: 0xfcd34d,
				front: 0xfef3c7,
				stroke: 0xf59e0b,
				shadow: 0xfef3c7,
			},
		},

		label: {
			fontFamily: "Arial",
			fontSize: 14,
			fill: 0x334155,
		},
	},
};
