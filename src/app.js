// src/app.js
import { Application, Container, Text } from "pixi.js";

// 1. Get the target element from the DOM first
const appContainer = document.getElementById("app");

if (!appContainer) {
	console.error("The #app element was not found in the HTML!");
	throw new Error("Missing #app div");
}

const app = new Application();

// 2. Initialize
await app.init({
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 0x1099bb,
	antialias: true,
	resolution: window.devicePixelRatio,
	// Force WebGL to ensure compatibility
	webgl: true,
});

// 3. Create Stage and Add Content
const stage = new Container();

const text = new Text({
	text: "Hello, PixiJS v8!",
	style: {
		fontFamily: "Arial",
		fontSize: 32,
		fill: "#ffffff",
		align: "center",
	},
});

text.anchor.set(0.5);
stage.addChild(text);
app.stage.addChild(stage);

// 4. CRITICAL STEP: Append the renderer view to the div
// In Vite environments, sometimes the view isn't auto-appended.
// We do this manually to ensure it's in the DOM.
const view = app.renderer.view;

if (view && view.tagName === "CANVAS") {
	// Only append if the view is not already a child of another element
	// We check if the view is already inside appContainer to avoid duplicates
	if (!appContainer.contains(view)) {
		appContainer.appendChild(view);
		console.log("Canvas attached to DOM:", view);
	}
} else {
	console.warn("Could not find a valid canvas view to attach.");
}

// 5. Handle Resize
window.addEventListener("resize", () => {
	app.renderer.resize(window.innerWidth, window.innerHeight);
});

console.log("App initialized and Canvas should be visible now.");
