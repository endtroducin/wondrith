// 📍 src/services/pouchdb.js
// 🗃️ External persistence layer (PouchDB)
//
// This file is a SERVICE.
// It communicates with storage only.
// It does NOT:
//   - mutate appState
//   - call renderers
//   - contain business logic
//
// Other parts of the app call this when they want persistence.

import PouchDB from "pouchdb-browser";

// ======================================================
// 1️⃣ Database Initialization
// ======================================================

// Single DB instance for entire app
export const db = new PouchDB("cards-db");

// ======================================================
// 2️⃣ Save Card
// ======================================================
// Saves or updates a card document.
// Caller is responsible for:
//   - Updating appState
//   - Updating UI
//   - Handling logic
//
// This function only persists data.
export async function saveCard(card) {
	// Ensure updated timestamp
	card.updatedAt = new Date().toISOString();

	try {
		// Attempt to load existing revision
		const existing = await db.get(card._id);

		// Required for updates
		card._rev = existing._rev;
	} catch (error) {
		// 404 = new document, safe to create
		if (error.status !== 404) {
			console.error("Unexpected DB error:", error);
			return;
		}
	}

	try {
		await db.put(card);
	} catch (error) {
		console.error("Failed to save card:", error);
	}
}

// ======================================================
// 3️⃣ Load All Cards
// ======================================================
// Returns array of card documents.
// Does NOT modify appState.
export async function loadAllCards() {
	try {
		const result = await db.allDocs({
			include_docs: true,
		});

		return result.rows.map((row) => row.doc);
	} catch (error) {
		console.error("Failed to load cards:", error);
		return [];
	}
}

// ======================================================
// 4️⃣ Delete Card (Optional but Recommended)
// ======================================================
export async function deleteCard(id) {
	try {
		const doc = await db.get(id);
		await db.remove(doc);
	} catch (error) {
		console.error("Failed to delete card:", error);
	}
}
