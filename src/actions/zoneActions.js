import { appState } from "../core/appState.js";

/**
 * Detects which zone (if any) a given x/y position is inside of.
 * Useful for card dragging logic — allows cards to react to entering zones.
 *
 * @param {Object} position - { x, y } coordinates of the point (usually the card center).
 * @returns {Object|null} - The matched zone object or null if none found.
 */
export function detectZone(position) {
	// 🧠 Convert zones from object → array so we can iterate with .find()
	const zones = Object.values(appState.zones);

	// 🔍 Find the first zone that contains the given point
	return zones.find((zone) => {
		const withinX = position.x > zone.x && position.x < zone.x + zone.width;
		const withinY = position.y > zone.y && position.y < zone.y + zone.height;
		return withinX && withinY;
	});
}
