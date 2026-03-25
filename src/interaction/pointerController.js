// ==================================================
// 📍 src/interaction/pointerController.js
// ==================================================
// 🖱️ POINTER CONTROLLER
//
// Raw pointer input only.
// For now this handles world panning and wheel zoom by
// updating camera state in appState.
//
// Important:
// We are moving the camera in world space.
// We are NOT moving display containers directly.
// ==================================================

import { appState } from "../core/appState.js";

/* ============================================================
   🖱️ INIT POINTER
============================================================ */

export function initPointer() {
	window.addEventListener("mousedown", (event) => {
		appState.interaction.isPanning = true;
		appState.interaction.lastPointerX = event.clientX;
		appState.interaction.lastPointerY = event.clientY;
	});

	window.addEventListener("mouseup", () => {
		appState.interaction.isPanning = false;
	});

	window.addEventListener("mousemove", (event) => {
		if (!appState.interaction.isPanning) {
			return;
		}

		// Measure pointer movement in screen pixels.
		const dx = event.clientX - appState.interaction.lastPointerX;
		const dy = event.clientY - appState.interaction.lastPointerY;

		appState.interaction.lastPointerX = event.clientX;
		appState.interaction.lastPointerY = event.clientY;

		// Convert screen drag into camera movement.
		//
		// Because this is a perspective top-down camera, the exact
		// world distance represented by one pixel varies slightly
		// with depth. For panning the ground plane, we approximate
		// using the ground plane scale at z = 0 under the camera.
		const groundDepth = appState.camera.z;
		const groundScale = appState.camera.focalLength / Math.max(1, groundDepth);

		// Dragging right should move the world right onscreen,
		// which means moving the camera left in world space.
		appState.camera.x -= dx / groundScale;
		appState.camera.y -= dy / groundScale;
	});

	window.addEventListener(
		"wheel",
		(event) => {
			event.preventDefault();

			// Wheel changes camera height instead of fake zoom.
			// Moving the camera lower increases perspective and scale.
			// Moving the camera higher decreases them.
			const factor = event.deltaY > 0 ? 1.08 : 0.92;

			appState.camera.z *= factor;

			// Clamp to a sane range.
			appState.camera.z = Math.max(300, Math.min(5000, appState.camera.z));
		},
		{ passive: false },
	);
}
