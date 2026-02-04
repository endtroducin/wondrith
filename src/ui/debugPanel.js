// src/ui/debugPanel.js
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

// // src/ui/debugPanel.js
// import { appState } from "../appState.js";

// let panel, toggle;

// export function initDebugPanel() {
// 	toggle = document.createElement("button");
// 	toggle.innerText = "⚙️";
// 	toggle.id = "debug-toggle";
// 	document.body.appendChild(toggle);

// 	panel = document.createElement("div");
// 	panel.id = "debug-panel";
// 	document.body.appendChild(panel);

// 	toggle.addEventListener("click", () => {
// 		appState.debug.panelVisible = !appState.debug.panelVisible;
// 		panel.classList.toggle("visible");
// 	});

// 	setInterval(() => {
// 		if (!appState.debug.panelVisible) return;
// 		panel.innerText = formatDebugOutput();
// 	}, 100);
// }

// function formatDebugOutput() {
// 	const { stage, debug } = appState;
// 	return `
// Cards: ${Object.keys(appState.cards).length}
// Dragging: ${debug.activeCardId || "None"}
// Stage: ${stage?.width?.()} × ${stage?.height?.()}
//   `.trim();
// }

// --------------------------------

// import { appState } from "../appState.js";

// let panel, toggleButton;

// // 🧪 Create the debug panel DOM element and start update loop
// export function initDebugPanel() {
// 	// 🔘 Toggle Button
// 	toggleButton = document.createElement("button");
// 	toggleButton.id = "debug-toggle";
// 	toggleButton.innerText = "⚙️";
// 	toggleButton.title = "Toggle Debug Panel";
// 	document.body.appendChild(toggleButton);

// 	// toggleButton.addEventListener("click", () => {
// 	// 	panel.classList.toggle("visible");
// 	// });

// 	// 🧱 Create Panel Element
// 	panel = document.createElement("div");
// 	panel.id = "debug-panel";
// 	panel.classList.add("visible"); // Start visible (optional)
// 	document.body.appendChild(panel);

// 	// Basic initial content
// 	panel.innerHTML = "<strong>Debug Panel</strong><pre id='debug-content'></pre>";

// 	// 🔁 Button logic
// 	toggleButton.addEventListener("click", () => {
// 		const isVisible = panel.classList.toggle("visible");
// 		appState.debug.panelVisible = isVisible;
// 		console.log(`[Debug] Panel visibility: ${isVisible}`);
// 	});

// 	// 🔁 Update loop (only when visible)
// 	setInterval(() => {
// 		if (!appState.debug.panelVisible) return;
// 		const content = formatDebugOutput();
// 		document.getElementById("debug-content").innerText = content;
// 	}, 100);
// }

// // 🧠 Pull values from appState and format nicely
// function formatDebugOutput() {
// 	const stage = appState.stage;

// 	// Get the position of the currently dragged card
// 	const activeCard = appState.activeDragCardId ? appState.cards[appState.activeDragCardId] : null;

// 	const cardX = activeCard ? Math.round(activeCard.position.x) : "—";
// 	const cardY = activeCard ? Math.round(activeCard.position.y) : "—";

// 	const stageWidth = stage?.width?.() || 0;
// 	const stageHeight = stage?.height?.() || 0;

// 	return `
// Card X: ${cardX}
// Card Y: ${cardY}

// Stage: ${stageWidth} × ${stageHeight}
// Dragging: ${activeCard ? "Yes" : "No"}
// Panel: ${appState.debug?.panelVisible ? "Visible" : "Hidden"}
// `.trim();
// }
