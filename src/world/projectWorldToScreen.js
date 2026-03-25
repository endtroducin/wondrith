// ==================================================
// 📍 src/world/projectWorldToScreen.js
// ==================================================
// 📐 PROJECT WORLD TO SCREEN
//
// True perspective projection for a camera looking
// straight down the negative z axis.
// ==================================================

import { appState } from "../core/appState.js";

/* ============================================================
   📐 PROJECT WORLD TO SCREEN
============================================================ */

export function projectWorldToScreen(x, y, z = 0) {
	const { camera, viewport } = appState;

	// Camera-relative coordinates on the ground plane.
	const relativeX = x - camera.x;
	const relativeY = y - camera.y;

	// Distance from point to camera along viewing direction.
	const depthToCamera = camera.z - z;

	// Prevent invalid projection.
	const safeDepth = Math.max(1, depthToCamera);

	// Perspective scale:
	// closer to camera => bigger projection.
	const perspectiveScale = camera.focalLength / safeDepth;

	// IMPORTANT:
	// We project around the center of the screen, not the top-left corner.
	const screenX = viewport.centerX + relativeX * perspectiveScale;
	const screenY = viewport.centerY + relativeY * perspectiveScale;

	return {
		x: screenX,
		y: screenY,
		scale: perspectiveScale,
		depth: safeDepth,
	};
}
