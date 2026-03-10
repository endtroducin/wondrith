// ==================================================
// 📍 src/constants/worldConfig.js
// ==================================================
// 🌍 WORLD CONFIGURATION
//
// Stores visual and environmental constants for the
// spatial world.
//
// Responsibilities:
//   • define background and fog values
//   • define grid settings
//   • define horizon settings
//   • define lighting settings
//
// Does NOT:
//   • store mutable application state
//   • create scene objects
//   • contain business logic
// ==================================================

/* ============================================================
   WORLD CONSTANTS
============================================================ */

export const WORLD = {
	BACKGROUND_COLOR: 0x07111f,
	FOG_COLOR: 0x07111f,
	FOG_NEAR: 100,
	FOG_FAR: 1000,

	GRID_SIZE: 5000,
	GRID_DIVISIONS: 100,
	GRID_PRIMARY_COLOR: 0x31506f,
	GRID_SECONDARY_COLOR: 0x1a2c40,
	GRID_OPACITY: 0.45,
	GRID_MINOR_STEP: 25,
	GRID_MAJOR_STEP: 100,

	GRID_MINOR_COLOR: 0x16324a,
	GRID_MAJOR_COLOR: 0x2f5b7a,

	GRID_MINOR_OPACITY: 0.32,
	GRID_MAJOR_OPACITY: 0.72,

	HORIZON_LENGTH: 600,
	HORIZON_COLOR: 0x61dafb,
	HORIZON_OPACITY: 0.9,

	AMBIENT_LIGHT_INTENSITY: 0.6,
	DIRECTIONAL_LIGHT_INTENSITY: 1.2,
	DIRECTIONAL_LIGHT_POSITION: {
		x: 40,
		y: -30,
		z: 60,
	},
};
