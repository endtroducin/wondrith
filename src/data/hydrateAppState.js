// ==================================================
// 📍 src/data/hydrateAppState.js
// ==================================================
// 🔄 APP STATE HYDRATOR
//
// Maps persisted entries into the current in-memory
// appState structure used by the renderer.
//
// Responsibilities:
//   • write entries into appState
//   • derive ideas render state
//   • derive tasks render state
//
// Does NOT:
//   • access Dexie directly
//   • create Three.js objects
//   • render frames
// ==================================================

// 2️⃣ Core state
import { appState } from "../core/appState.js";

// 4️⃣ Internal modules
import { ENTRY_TYPES, entryToIdeaRenderState, entryToTaskRenderState } from "./entrySchema.js";

/* ============================================================
   HYDRATION
============================================================ */

export function hydrateAppStateFromEntries(entries) {
	appState.entriesById = {};
	appState.entryOrder = [];
	appState.ideas = [];
	appState.tasks = [];

	for (const entry of entries) {
		appState.entriesById[entry.id] = entry;
		appState.entryOrder.push(entry.id);

		if (entry.type === ENTRY_TYPES.IDEA) {
			appState.ideas.push(entryToIdeaRenderState(entry));
		}

		if (entry.type === ENTRY_TYPES.TASK) {
			appState.tasks.push(entryToTaskRenderState(entry));
		}
	}
}

/* ============================================================
   DERIVED RENDER STATE
============================================================ */

export function rebuildDerivedRenderState() {
	appState.ideas = [];
	appState.tasks = [];

	for (const entryId of appState.entryOrder) {
		const entry = appState.entriesById[entryId];

		if (!entry) {
			continue;
		}

		if (entry.type === ENTRY_TYPES.IDEA) {
			appState.ideas.push(entryToIdeaRenderState(entry));
		}

		if (entry.type === ENTRY_TYPES.TASK) {
			appState.tasks.push(entryToTaskRenderState(entry));
		}
	}
}
