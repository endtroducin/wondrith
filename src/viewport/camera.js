// ==================================================
// 📍 src/viewport/camera.js
// ==================================================
// 📐 CAMERA PROJECTION
//
// Handles projecting world coordinates (x, y, z)
// onto 2D screen coordinates based on the camera's position.
// ==================================================

import { appState } from "../core/appState.js";

/* ============================================================
   📐 PROJECT POINT TO SCREEN
============================================================ */

/**
 * Converts a 3D world point into 2D screen coordinates.
 *
 * @param {number} x - World X coordinate
 * @param {number} y - World Y coordinate
 * @param {number} z - World Z coordinate (height)
 * @returns {object} Screen {x, y, scale} and depth info
 */
export function projectWorldToScreen(x, y, z) {
	// Read the current camera position from the single source of truth.
	const { camera, viewport } = appState;

	// Calculate the horizontal offset from the camera center.
	const relativeX = x - camera.x;

	// Calculate the vertical offset from the camera center.
	const relativeY = y - camera.y;

	// Calculate distance from the point to the camera height plane.
	const depth = camera.z - z;

	// Guard clause: Prevent division by zero or negative depth.
	const safeDepth = Math.max(1, depth);

	// Calculate perspective scale factor.
	const scale = camera.focalLength / safeDepth;

	// Project the relative offset onto the screen, centered on the viewport.
	const screenX = viewport.centerX + relativeX * scale;
	const screenY = viewport.centerY + relativeY * scale;

	return {
		x: screenX,
		y: screenY,
		scale,
		depth: safeDepth,
	};
}
