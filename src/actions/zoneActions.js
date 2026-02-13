import { appState } from "../core/appState.js";

/**
 * Detects which zone (if any) a given x/y position is inside of.
 * Useful for card dragging logic — allows cards to react to entering zones.
 *
 * @param {Object} position - { x, y } coordinates of the point (usually the card center).
 * @returns {Object|null} - The matched zone object or null if none found.
 */
export function detectZone(worldY) {
	return worldY < 0 ? "idea" : "task";
}
