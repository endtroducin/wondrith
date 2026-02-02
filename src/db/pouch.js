// src/db/pouch.js
import PouchDB from "pouchdb-browser";
export const db = new PouchDB("cards-db");

export async function saveCard(card) {
	card.lastUpdated = new Date().toISOString();

	try {
		const existing = await db.get(card._id);
		card._rev = existing._rev;
	} catch (e) {
		if (e.status !== 404) {
			console.error("🔥 Unexpected error loading card for save:", e);
			return;
		}
		// Safe to create new doc if 404
	}

	try {
		await db.put(card);
		console.log("💾 Card saved:", card._id);
	} catch (e) {
		console.error("🛑 Failed to save card:", e);
	}
}

export async function deleteCard(id) {
	try {
		const doc = await db.get(id);
		await db.remove(doc);
	} catch (e) {}
}

export async function loadAllCards() {
	const res = await db.allDocs({ include_docs: true });
	return res.rows.map((r) => r.doc);
}

// import PouchDB from "pouchdb-browser";

// export const db = new PouchDB("cards-db");

// // 🧠 Save or update a card in PouchDB
// export async function saveCard(card) {
// 	try {
// 		// Try to get the latest doc (may or may not exist)
// 		const existing = await db.get(card._id);
// 		card._rev = existing._rev; // sync revision before update
// 	} catch (err) {
// 		if (err.status !== 404) {
// 			console.error("⚠️ Unexpected error fetching doc:", err);
// 			return;
// 		}
// 		// 404 is okay — new document
// 	}

// 	try {
// 		await db.put(card);
// 		console.log("💾 Card saved:", card._id);
// 	} catch (err) {
// 		console.error("🔴 Conflict or other error:", err);
// 	}
// }

// // 📦 Load all cards
// export async function loadAllCards() {
// 	const result = await db.allDocs({ include_docs: true });
// 	return result.rows.map((row) => row.doc);
// }

// export async function deleteCard(cardId) {
// 	try {
// 		const card = await db.get(cardId);
// 		await db.remove(card);
// 		console.log("🗑️ Deleted card:", cardId);
// 	} catch (e) {
// 		console.warn("Failed to delete card:", e.message);
// 	}
// }
