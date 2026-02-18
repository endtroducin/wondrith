// 📍 src/actions/zoneActions.js
// 📦 Zone detection logic
//
// This file:
//   • Reads from appState.zones
//   • Performs spatial math
//   • Returns matching zone
//
// It does NOT:
//   • Modify appState
//   • Trigger rendering
//   • Trigger animations
//   • Persist data
//
// Pure spatial detection only.

import { appState } from "../core/appState.js";

// ==================================================
// 🔍 DETECT ZONE
// ==================================================

/**
 * Determines which zone (if any) a world position belongs to.
 *
 * @param {Object} position
 * @param {number} position.x - World X coordinate
 * @param {number} position.y - World Y coordinate
 *
 * @returns {Object|null}
 *   Returns the full zone object if matched.
 *   Returns null if outside all zones.
 */
export function detectZone(position) {
	// --------------------------------------------------
	// 🧠 READ FROM SSOT
	// --------------------------------------------------
	const zones = appState.zones;

	// --------------------------------------------------
	// 🔄 LOOP THROUGH ALL ZONES
	// --------------------------------------------------
	for (const zoneKey in zones) {
		const zone = zones[zoneKey];

		// --------------------------------------------------
		// 📐 CHECK BOUNDS
		// --------------------------------------------------
		const withinX = position.x >= zone.x && position.x <= zone.x + zone.width;

		const withinY = position.y >= zone.y && position.y <= zone.y + zone.height;

		// --------------------------------------------------
		// ✅ MATCH FOUND
		// --------------------------------------------------
		if (withinX && withinY) {
			return zone;
		}
	}

	// --------------------------------------------------
	// ❌ NO MATCH
	// --------------------------------------------------
	return null;
}
