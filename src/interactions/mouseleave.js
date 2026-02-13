import { appState } from "../core/appState.js";

export function mouseleaveHandler(evt) {
	appState.debug.hoveredCardId = null;

	// Optional: Add visual reset here using evt.target.getParent() if needed
}
