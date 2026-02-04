import { appState } from "./appState.js";

//#region 🧊 Window Resize Listener
/**
 * 🧠 Sync stage dimensions with window size.
 */
export function updateStageSize() {
	if (!appState.canvas) return;

	appState.canvas.width = window.innerWidth;
	appState.canvas.height = window.innerHeight;

	// Optional: redraw canvas
	if (appState.layer) {
		appState.layer.draw();
	}
}

/**
 * 🚀 Initialize resize listener (call this once in main.js)
 */
export function setupResizeListener() {
	updateStageSize(); // initial load

	window.addEventListener("resize", updateStageSize);
}
//#endregion

//#region 🧊 Mouse Position
export function setupMousePositionListener() {
	window.addEventListener("mousemove", (e) => {
		appState.mouse = {
			x: e.clientX,
			y: e.clientY,
		};
	});
}
//#endregion

//
