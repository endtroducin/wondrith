// 📍 src/ui/debugPanel.js
// 🛠️ Renders floating debug UI and reads live values from appState.
// This file:
//   - Creates DOM elements
//   - Reads from appState
//   - Calls camera actions
//   - Toggles grid visibility
//
// It does NOT:
//   - Mutate card data
//   - Move the camera directly
//   - Perform rendering logic

import { setCameraZone } from "../actions/cameraActions.js";
import { appState } from "../core/appState.js";
import { drawGrid } from "./gridRenderer.js";

let panel;
let toggle;
let debugTextBlock;
let updateInterval;

/* ============================================================
   🚀 INITIALIZE DEBUG PANEL
============================================================ */

export function initDebugPanel() {
	// --------------------------------------------------
	// 🔎 SSOT References
	// --------------------------------------------------

	const debugState = appState.debug;

	// Prevent duplicates
	if (document.getElementById("debug-panel")) return;

	// --------------------------------------------------
	// 🔘 Toggle Button
	// --------------------------------------------------

	toggle = document.createElement("button");
	toggle.id = "debug-toggle";
	toggle.innerText = "⚙️ Debug";

	Object.assign(toggle.style, {
		position: "fixed",
		top: "10px",
		right: "10px",
		zIndex: "9999",
		padding: "6px",
	});

	document.body.appendChild(toggle);

	// --------------------------------------------------
	// 🧱 Panel Container
	// --------------------------------------------------

	panel = document.createElement("div");
	panel.id = "debug-panel";

	Object.assign(panel.style, {
		position: "fixed",
		top: "50px",
		right: "10px",
		width: "260px",
		background: "rgba(0,0,0,0.85)",
		color: "#0f0",
		fontFamily: "monospace",
		fontSize: "12px",
		padding: "8px",
		borderRadius: "6px",
		whiteSpace: "pre-wrap",
		zIndex: "9998",
	});

	document.body.appendChild(panel);

	// --------------------------------------------------
	// 🧩 Default Visibility
	// --------------------------------------------------

	debugState.panelVisible = true;
	panel.style.display = "block";

	// --------------------------------------------------
	// 📄 Text Block
	// --------------------------------------------------

	debugTextBlock = document.createElement("pre");
	debugTextBlock.style.marginBottom = "8px";
	panel.appendChild(debugTextBlock);

	// --------------------------------------------------
	// 🎛️ Camera Buttons
	// --------------------------------------------------

	const buttonRow = document.createElement("div");

	buttonRow.innerHTML = `
	<button>📷 Idea</button>
	<button>📷 Plan</button>
	<button>📷 Task</button>
	`;

	Array.from(buttonRow.children).forEach((btn) => {
		btn.style.margin = "4px 4px 0 0";
		btn.style.fontSize = "12px";
		btn.style.cursor = "pointer";
	});

	panel.appendChild(buttonRow);

	const [btnIdea, btnPlan, btnTask] = buttonRow.querySelectorAll("button");

	btnIdea.onclick = () => setCameraZone("idea");
	btnPlan.onclick = () => setCameraZone("plan");
	btnTask.onclick = () => setCameraZone("task");

	// --------------------------------------------------
	// 🔁 Toggle Logic
	// --------------------------------------------------

	toggle.addEventListener("click", () => {
		debugState.panelVisible = !debugState.panelVisible;

		panel.style.display = debugState.panelVisible ? "block" : "none";

		drawGrid();
	});

	// --------------------------------------------------
	// 🖥️ Passive Update Loop
	// --------------------------------------------------

	updateInterval = setInterval(() => {
		if (!debugState.panelVisible) return;

		debugTextBlock.textContent = formatDebugText();
	}, 120);
}

/* ============================================================
   📝 FORMAT DEBUG TEXT
============================================================ */

function formatDebugText() {
	// --------------------------------------------------
	// 🔎 SSOT References
	// --------------------------------------------------

	const mouse = appState.mouse;
	const canvas = appState.canvas;
	const cards = appState.cards;
	const cameraBounds = appState.camera.bounds;
	const hoveredId = appState.debug.hoveredCardId;
	const activeDrag = appState.debug.activeCardId;
	const heightUnderMouse = getHeightUnderMouse();

	let hoveredCardDetails = "  None";

	if (hoveredId && cards[hoveredId]) {
		const card = cards[hoveredId];

		hoveredCardDetails = `
  Title:      ${card.title}
  Type:       ${card.type}
  Position:   x: ${Math.round(card.position.x)}, y: ${Math.round(card.position.y)}
  Z Height:   ${card.position.z ?? "derived"}
  Friction:   ${card.frictionLevel}
  Zone:       ${card.currentZone || "None"}
`;
	}

	return `
🛠️  Debug Panel
━━━━━━━━━━━━━━━━━━━━━━━━
Time:        ${new Date().toLocaleTimeString()}
Mouse:       ${mouse.x} × ${mouse.y}
Canvas:      ${canvas.width} × ${canvas.height}
Cards:       ${Object.keys(cards).length}
Dragging:    ${activeDrag || "None"}

📏 Height Under Mouse
━━━━━━━━━━━━━━━━━━━━━━━━
Z:         ${Math.round(heightUnderMouse)}
Cam Height: ${appState.camera.height}
Zoom:       ${appState.camera.zoom}

📷 Camera View
━━━━━━━━━━━━━━━━━━━━━━━━
Top:       ${Math.round(cameraBounds.top)}
Right:     ${Math.round(cameraBounds.right)}
Bottom:    ${Math.round(cameraBounds.bottom)}
Left:      ${Math.round(cameraBounds.left)}

🖱️ Hovered Card
━━━━━━━━━━━━━━━━━━━━━━━━
${hoveredCardDetails}
`.trim();
}

/* ============================================================
   📏 HEIGHT UNDER MOUSE
============================================================ */

function getHeightUnderMouse() {
	const stage = appState.stage;
	const cards = appState.cards;
	const rendered = appState.renderedCards;

	if (!stage) return 1;

	const pointer = stage.getPointerPosition();
	if (!pointer) return 1;

	const shape = stage.getIntersection(pointer);
	if (!shape) return 1;

	// Walk up to group
	const group = shape.getParent();
	if (!group) return 1;

	const cardId = group.id();
	const card = cards[cardId];

	if (!card) return 1;

	// Return top of object
	return (card.elevation ?? 1) + (card.height ?? 0);
}
