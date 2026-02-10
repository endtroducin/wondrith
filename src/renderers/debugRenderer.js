// Imports
import { appState } from "../core/appState.js";

let panel, toggle;

export function initDebugPanel() {
	// Prevent duplicate panels
	if (document.getElementById("debug-panel")) return;

	// Create toggle button
	toggle = document.createElement("button");
	toggle.id = "debug-toggle";
	toggle.innerText = "⚙️ Debug";
	toggle.style.position = "fixed";
	toggle.style.top = "10px";
	toggle.style.right = "10px";
	toggle.style.zIndex = "9999";
	toggle.style.padding = "6px";
	document.body.appendChild(toggle);

	// Create the panel
	panel = document.createElement("div");
	panel.id = "debug-panel";
	panel.style.position = "fixed";
	panel.style.top = "50px";
	panel.style.right = "10px";
	panel.style.width = "250px";
	panel.style.background = "rgba(0,0,0,0.8)";
	panel.style.color = "#0f0";
	panel.style.fontFamily = "monospace";
	panel.style.fontSize = "12px";
	panel.style.padding = "8px";
	panel.style.borderRadius = "6px";
	panel.style.zIndex = "9998";
	panel.style.whiteSpace = "pre-wrap";
	document.body.appendChild(panel);

	// Default visible
	appState.debug.panelVisible = true;
	panel.style.display = "block";

	// Toggle logic
	toggle.addEventListener("click", () => {
		appState.debug.panelVisible = !appState.debug.panelVisible;
		panel.style.display = appState.debug.panelVisible ? "block" : "none";
	});

	// Update loop
	setInterval(() => {
		if (!appState.debug.panelVisible) return;
		panel.textContent = getDebugText();
	}, 100);
}

function getDebugText() {
	let hoveredCardDetails = "  None";
	const hoveredId = appState.debug.hoveredCardId;

	if (hoveredId && appState.cards[hoveredId]) {
		const card = appState.cards[hoveredId];
		hoveredCardDetails = `  Title:      ${card.title}
  Type:       ${card.type}
  Position:   x: ${Math.round(card.position.x)}, y: ${Math.round(card.position.y)}
`;
	}

	return `
🛠️  Debug Panel
━━━━━━━━━━━━━━━━━━━━━━━━
🧊Mouse:       ${appState.mouse.x} × ${appState.mouse.y}
🧊Canvas:      ${appState.canvas.width} × ${appState.canvas.height}
Cards:       ${Object.keys(appState.cards).length}
Dragging:    ${appState.activeDragCardId || "None"}

🖱️ Hovered Card:
━━━━━━━━━━━━━━━━━━━━━━━━
${hoveredCardDetails}
`.trim();
}
