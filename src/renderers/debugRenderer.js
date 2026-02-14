// 📍 src/ui/debugPanel.js
// 🛠️ Renders the floating debug panel and updates it live based on appState

import { moveCameraTo, setCameraZone } from "../actions/cameraActions.js";
import { appState } from "../core/appState.js";
import { drawGrid } from "./gridRenderer.js";
// import { moveCameraTo } from "../actions/cameraActions.js";

let panel, toggle, debugTextBlock;

export function initDebugPanel() {
	// 🔁 Avoid duplicates
	if (document.getElementById("debug-panel")) return;

	// 🧲 Toggle Button
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

	// 🧱 Debug Panel Element
	panel = document.createElement("div");
	panel.id = "debug-panel";
	Object.assign(panel.style, {
		position: "fixed",
		top: "50px",
		right: "10px",
		width: "250px",
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

	// 🧩 Default state is visible
	appState.debug.panelVisible = true;
	panel.style.display = "block";

	// ✏️ Create a text block for real-time updates
	debugTextBlock = document.createElement("pre");
	debugTextBlock.id = "debug-text";
	debugTextBlock.style.marginBottom = "8px";
	panel.appendChild(debugTextBlock);

	// 🎛️ Add camera control buttons
	const buttonRow = document.createElement("div");
	buttonRow.innerHTML = `
	<button>📷 Idea</button><button>📷 Plan</button><button>📷 Task</button>
	`;
	Array.from(buttonRow.children).forEach((btn) => {
		btn.style.margin = "4px 4px 0 0";
		btn.style.fontSize = "12px";
		btn.style.cursor = "pointer";
	});
	panel.appendChild(buttonRow);

	// 🎯 Hook up camera actions
	const [btnIdea, btnPlan, btnTask] = buttonRow.querySelectorAll("button");
	btnIdea.onclick = () => moveCameraTo("idea");
	btnPlan.onclick = () => moveCameraTo("plan");
	btnTask.onclick = () => moveCameraTo("task");

	// 🎛️ Toggle logic
	toggle.addEventListener("click", () => {
		appState.debug.panelVisible = !appState.debug.panelVisible;
		panel.style.display = appState.debug.panelVisible ? "block" : "none";
		drawGrid();
	});

	// 🖥️ Passive UI Update Loop
	setInterval(() => {
		if (!appState.debug.panelVisible) return;
		debugTextBlock.textContent = formatDebugText();
	}, 100); // Refresh every 250ms (adjust if needed)
}

function formatDebugText() {
	let hoveredCardDetails = "  None";
	const hoveredId = appState.debug.hoveredCardId;

	if (hoveredId && appState.cards[hoveredId]) {
		const card = appState.cards[hoveredId];
		hoveredCardDetails = `  Title:      ${card.title}
  Type:       ${card.type || "Unknown"}
  Position:   x: ${Math.round(card.position.x)}, y: ${Math.round(card.position.y)}
  Zone:       ${card.currentZone || "None"}
`;
	}

	return `
🛠️  Debug Panel
━━━━━━━━━━━━━━━━━━━━━━━━
Time:        ${new Date().toLocaleTimeString()}
Mouse:       ${appState.mouse.x} × ${appState.mouse.y}
Canvas:      ${appState.canvas.width} × ${appState.canvas.height}
Cards:       ${Object.keys(appState.cards).length}
Dragging:    ${appState.activeDragCardId || "None"}

📷 Camera View:
━━━━━━━━━━━━━━━━━━━━━━━━
Top:       ${Math.round(appState.camera.bounds.top)}
Right:     ${Math.round(appState.camera.bounds.right)}
Bottom:    ${Math.round(appState.camera.bounds.bottom)}
Left:      ${Math.round(appState.camera.bounds.left)}

🖱️ Hovered Card:
━━━━━━━━━━━━━━━━━━━━━━━━
${hoveredCardDetails}
`.trim();
}
