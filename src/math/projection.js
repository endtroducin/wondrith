// ==================================================
// 📍 src/math/projection.js
// ==================================================
// 🎥 2.5D PROJECTION (PURE MATH)
//
// Domain: math
// Question: How do WORLD coordinates convert to SCREEN coordinates?
//
// Model (2.5D "extrusion"):
//   • World is fixed
//   • Camera is a viewport over world x/y
//   • Zoom scales x/y uniformly
//   • z does NOT change width
//   • z pushes upward on screen (visual height)
//
// ✅ Rules
//   • PURE (no appState imports)
//   • No Konva
//
// ==================================================

/* ============================================================
   🌍 WORLD → SCREEN
============================================================ */

export function projectWorldToScreen(world, camera, opts = {}) {
	// --------------------------------------------------
	// 🚪 GUARDS
	// --------------------------------------------------
	if (!world || !camera) return { x: 0, y: 0, scale: 1 };

	// --------------------------------------------------
	// 🔎 INPUTS
	// --------------------------------------------------
	const worldX = Number(world.x ?? 0);
	const worldY = Number(world.y ?? 0);
	const worldZ = Number(world.z ?? 0);

	const cameraX = Number(camera.x ?? 0);
	const cameraY = Number(camera.y ?? 0);
	const zoom = Number(camera.zoom ?? 1);

	// how much z pushes "up" in screen pixels (before zoom)
	const depthScale = Number(opts.depthScale ?? 1);

	if (!Number.isFinite(zoom) || zoom <= 0) return { x: 0, y: 0, scale: 1 };

	// --------------------------------------------------
	// 🧮 PROJECT
	// --------------------------------------------------
	// base world-to-screen
	const sx = (worldX - cameraX) * zoom;
	const sy = (worldY - cameraY) * zoom;

	// z extrusion (upwards on screen)
	const syZ = sy - worldZ * depthScale * zoom;

	return { x: sx, y: syZ, scale: zoom };
}

/* ============================================================
   🔁 SCREEN → WORLD (at a given z)
============================================================ */

export function unprojectScreenToWorld(screen, camera, z = 0, opts = {}) {
	// --------------------------------------------------
	// 🚪 GUARDS
	// --------------------------------------------------
	if (!screen || !camera) return { x: 0, y: 0 };

	const screenX = Number(screen.x ?? 0);
	const screenY = Number(screen.y ?? 0);

	const cameraX = Number(camera.x ?? 0);
	const cameraY = Number(camera.y ?? 0);
	const zoom = Number(camera.zoom ?? 1);

	const depthScale = Number(opts.depthScale ?? 1);

	if (!Number.isFinite(zoom) || zoom <= 0) return { x: 0, y: 0 };

	// --------------------------------------------------
	// 🧮 INVERSE
	// --------------------------------------------------
	// undo z extrusion first (because screenY already includes it)
	const baseY = screenY + Number(z ?? 0) * depthScale * zoom;

	const worldX = screenX / zoom + cameraX;
	const worldY = baseY / zoom + cameraY;

	return { x: worldX, y: worldY };
}
