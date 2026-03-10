// ==================================================
// 📍 src/render/sceneRenderer.js
// ==================================================
// 🌍 THREE.JS SCENE RENDERER
//
// Creates and manages the Three.js scene, camera,
// renderer, viewport sizing, and render scheduling.
//
// Responsibilities:
//   • create scene
//   • create camera
//   • create renderer
//   • resize renderer
//   • expose viewport size
//   • schedule renders only when needed
//   • render frames
//
// Does NOT:
//   • own camera behavior
//   • contain business logic
//   • build world objects from appState
// ==================================================

// 1️⃣ External libraries
import * as THREE from "three";

// 2️⃣ Core state
import { appState } from "../core/appState.js";

// 3️⃣ Constants
import { WORLD } from "../constants/worldConfig.js";

/* ============================================================
   MODULE STATE
============================================================ */

let scene;
let camera;
let renderer;
let rootElement;

let renderCallback = null;
let isRenderScheduled = false;

/* ============================================================
   INIT RENDERER
============================================================ */

export function initSceneRenderer(container) {
	rootElement = container;

	// --------------------------------------------------
	// Create scene
	// --------------------------------------------------

	scene = new THREE.Scene();
	scene.background = new THREE.Color(WORLD.BACKGROUND_COLOR);
	scene.fog = new THREE.Fog(WORLD.FOG_COLOR, WORLD.FOG_NEAR, WORLD.FOG_FAR);

	// --------------------------------------------------
	// Create camera
	// --------------------------------------------------

	camera = new THREE.PerspectiveCamera(appState.camera.fov, 1, appState.camera.near, appState.camera.far);

	// --------------------------------------------------
	// Create renderer
	// --------------------------------------------------

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		powerPreference: "default",
	});

	// Lower cap helps a lot on laptops
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
	renderer.setSize(rootElement.clientWidth || window.innerWidth, rootElement.clientHeight || window.innerHeight);
	renderer.outputColorSpace = THREE.SRGBColorSpace;

	rootElement.appendChild(renderer.domElement);

	window.addEventListener("resize", handleResize);
}

/* ============================================================
   RENDER SCHEDULING
============================================================ */

export function setRenderCallback(callback) {
	renderCallback = callback;
}

export function requestRender() {
	if (isRenderScheduled) {
		return;
	}

	isRenderScheduled = true;

	requestAnimationFrame(() => {
		isRenderScheduled = false;

		if (renderCallback) {
			renderCallback();
		} else {
			renderFrame();
		}
	});
}

/* ============================================================
   VIEWPORT
============================================================ */

export function getViewportSize() {
	return {
		width: rootElement?.clientWidth || window.innerWidth,
		height: rootElement?.clientHeight || window.innerHeight,
	};
}

/* ============================================================
   RESIZE
============================================================ */

export function handleResize() {
	if (!renderer || !rootElement) {
		return;
	}

	const width = rootElement.clientWidth || window.innerWidth;
	const height = rootElement.clientHeight || window.innerHeight;

	renderer.setSize(width, height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

	requestRender();
}

/* ============================================================
   RENDER FRAME
============================================================ */

export function renderFrame() {
	if (!scene || !camera || !renderer) {
		return;
	}

	renderer.render(scene, camera);
}

/* ============================================================
   GETTERS
============================================================ */

export function getScene() {
	return scene;
}

export function getCamera() {
	return camera;
}

export function getRenderer() {
	return renderer;
}

export function getRendererDomElement() {
	return renderer?.domElement ?? null;
}

/* ============================================================
   DISPOSE
============================================================ */

export function disposeSceneRenderer() {
	window.removeEventListener("resize", handleResize);

	if (renderer) {
		renderer.dispose();

		if (renderer.domElement?.parentNode) {
			renderer.domElement.parentNode.removeChild(renderer.domElement);
		}
	}

	scene = undefined;
	camera = undefined;
	renderer = undefined;
	rootElement = undefined;
	renderCallback = null;
	isRenderScheduled = false;
}
