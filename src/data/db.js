// ==================================================
// 📍 src/data/db.js
// ==================================================
// 💾 DEXIE DATABASE
//
// Creates and exports the Dexie database instance
// for entry persistence.
//
// Responsibilities:
//   • create Dexie database instance
//   • define IndexedDB schema
//   • expose database tables
//
// Does NOT:
//   • contain business rules
//   • shape entry payloads
//   • mutate appState
// ==================================================

// 1️⃣ External libraries
import Dexie from "dexie";

/* ============================================================
   DATABASE
============================================================ */

export const db = new Dexie("spatialProductivityDb");

/* ============================================================
   SCHEMA
============================================================ */

db.version(1).stores({
	entries: "id, type, status, updatedAt, createdAt",
});
