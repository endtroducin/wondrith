// ==================================================
// 📍 src/main.js
// ==================================================
// 🚀 APPLICATION ENTRY POINT
//
// Boots the engine foundation and wires together
// state, renderer, world builder, camera system,
// drag interaction, and persistence.
//
// Responsibilities:
//   • initialize renderer
//   • initialize camera system
//   • initialize world builder
//   • initialize drag interaction
//   • render only when needed
//
// Does NOT:
//   • store business logic in meshes
//   • act as world state
//   • enable manual camera controls
// ==================================================

// 1️⃣ External libraries
import "../styles.css";

// 2️⃣ Core state
import { appState } from "./core/appState.js";

// 4️⃣ Internal modules
import {
	initSceneRenderer,
	renderFrame,
	getScene,
	getCamera,
	getViewportSize,
	getRendererDomElement,
	requestRender,
	setRenderCallback,
} from "./render/sceneRenderer.js";

import {
	initCameraSystem,
	updateCameraTransition,
	zoomIn,
	zoomOut,
	setIdeaCameraView,
	setPlanCameraView,
	setTaskCameraView,
} from "./interaction/cameraSystem.js";

import {
	initWorldBuilder,
	syncWorldFromState,
	getDraggableMeshes,
	getEntityIdForMesh,
	getEntityTypeForMesh,
} from "./world/worldBuilder.js";

import { initDragInteraction } from "./interaction/dragInteraction.js";

import { seedStarterEntries, listEntries, clearAllEntries } from "./data/entryRepository.js";

import { hydrateAppStateFromEntries } from "./data/hydrateAppState.js";

/* ============================================================
   BOOTSTRAP
============================================================ */

const sceneRoot = document.getElementById("scene-root");

if (!sceneRoot) {
	throw new Error("Missing #scene-root element.");
}

// --------------------------------------------------
// Temporary reset during visual rebuild
// --------------------------------------------------

// await clearAllEntries();

await seedStarterEntries();

const entries = await listEntries();
hydrateAppStateFromEntries(entries);

initSceneRenderer(sceneRoot);
initCameraSystem(getCamera(), getViewportSize, requestRender);
initWorldBuilder(getScene());

initDragInteraction({
	camera: getCamera(),
	domElement: getRendererDomElement(),
	getDraggableMeshList: getDraggableMeshes,
	getEntityIdForMesh,
	getEntityTypeForMesh,
	requestRender,
});

/* ============================================================
   RENDER PIPELINE
============================================================ */

function renderApp() {
	syncWorldFromState();
	renderFrame();

	if (updateCameraTransition()) {
		requestRender();
	}
}

setRenderCallback(renderApp);
requestRender();

/* ============================================================
   TEMPORARY INPUT
============================================================ */

window.addEventListener("keydown", (event) => {
	if (event.key === "1") {
		setIdeaCameraView(700);
	}

	if (event.key === "2") {
		setPlanCameraView(700);
	}

	if (event.key === "3") {
		setTaskCameraView(700);
	}

	if (event.key === "=" || event.key === "+") {
		zoomIn(450);
	}

	if (event.key === "-" || event.key === "_") {
		zoomOut(450);
	}
});

/* ============================================================
   PAGE VISIBILITY
============================================================ */

document.addEventListener("visibilitychange", () => {
	if (!document.hidden) {
		requestRender();
	}
});

/* ============================================================
   DEBUG ACCESS
============================================================ */

window.__APP__ = {
	appState,
	clearAllEntries,
};
