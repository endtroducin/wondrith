// ==================================================
// 📍 src/core/appState.js
// ==================================================
// 🧠 APPLICATION STATE
//
// Defines the single source of truth for the spatial
// productivity world.
//
// Responsibilities:
//   • store canonical entries
//   • store derived task and idea render arrays
//   • store camera state
//
// Does NOT:
//   • access Dexie directly
//   • create Three.js objects
//   • render anything
// ==================================================

/* ============================================================
   APPLICATION STATE
============================================================ */

export const appState = {
	camera: {
		mode: "perspectiveTopDown",

		fov: 100,
		near: 0.1,
		far: 2000,

		leftWorldX: 0,

		viewHeight: 240,
		minViewHeight: 120,
		maxViewHeight: 900,
		zoomStep: 30,

		section: "plan",
		sectionAnchor: 0.5,

		target: { x: 0, y: 0, z: 0 },
		position: { x: 0, y: 0, z: 0 },

		transition: {
			isActive: false,
			startTime: 0,
			durationMs: 700,
			startViewHeight: 300,
			targetViewHeight: 300,
			startSectionAnchor: 0.5,
			targetSectionAnchor: 0.5,
		},
	},

	entriesById: {},
	entryOrder: [],

	ideas: [],
	tasks: [],
};
