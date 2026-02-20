// 📍 src/helpers/projection.js
// ======================================================
// 📐 2.5D PROJECTION HELPERS (PURE MATH)
// ======================================================
// No appState imports.
// No Konva.
// Just numbers in → numbers out.
// ======================================================

/**
 * Computes a visual scale for an object at a given elevation.
 *
 * Mental model:
 * - cameraHeight is "distance from ground plane"
 * - elevation is "toward viewer" (bigger elevation => closer => bigger)
 * - zoom is final screen magnification
 *
 * We reduce the z-effect as the camera "pulls back" (zoom out):
 * effectiveHeight increases when zoom decreases.
 */
export function computeProjectedScale({ cameraHeight, zoom, elevation, clampMin = 0.25, clampMax = 4 }) {
	// --------------------------------------------------
	// 🧮 DERIVED VALUES
	// --------------------------------------------------

	const safeZoom = Number.isFinite(zoom) ? zoom : 1;
	const safeHeight = Number.isFinite(cameraHeight) ? cameraHeight : 100;
	const safeElevation = Number.isFinite(elevation) ? elevation : 0;

	// "Pull back" reduces depth effect:
	// zoom 0.5 => effectiveHeight doubles
	const effectiveHeight = safeHeight / safeZoom;

	// Distance from camera plane (must not hit 0)
	const distance = Math.max(1, effectiveHeight - safeElevation);

	// Perspective scale (1 at elevation=0 when effectiveHeight==distance)
	const perspectiveScale = effectiveHeight / distance;

	// Final scale includes zoom (screen magnification)
	const finalScale = perspectiveScale * safeZoom;

	// Clamp so it doesn't go insane
	return Math.max(clampMin, Math.min(clampMax, finalScale));
}
