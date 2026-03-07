---
name: Format Guide
---
# Rules for formatting...
# FORMAT_GUIDE.md
# File Formatting + Commenting Standard

All generated code must follow this format exactly.

If code does not follow this structure, it must be rewritten.

---

# 1️⃣ FILE HEADER FORMAT

Every file must begin with:

// ==================================================
// 📍 src/path/to/file.js
// ==================================================
// 🔹 SHORT TITLE (ALL CAPS)
//
// Domain: <domain>
// Responsibility:
//   - bullet
//   - bullet
//
// Rules:
//   - bullet
//   - bullet
// ==================================================

The header must clearly define:
- Domain
- What it does
- What it does NOT do

---

# 2️⃣ SECTION BLOCK FORMAT

Major blocks must use:

/* ============================================================
   🔹 SECTION TITLE
============================================================ */

Single-line separator:

// --------------------------------------------------
// 🔹 SUBSECTION
// --------------------------------------------------

Never mix the two styles randomly.

---

# 3️⃣ SSOT REFERENCE BLOCK

Every function must begin with:

// --------------------------------------------------
// 🔎 SSOT REFERENCES
// --------------------------------------------------

const camera = appState.camera;
const canvas = appState.canvas;

This prevents random deep access inside logic.

---

# 4️⃣ COMMENT DENSITY RULE

Code must explain:

- Why something is done
- What coordinate space it is operating in
- What assumptions exist
- What side effects occur

Do NOT just describe the obvious.

Bad:
x += 5 // add 5

Good:
x += 5 // shift world coordinate 5 units right

---

# 5️⃣ COORDINATE CLARITY RULE

Never abbreviate:

- worldX (not wx)
- screenX (not sx)
- cameraX (not cx)

Readability > brevity.

---

# 6️⃣ NO MAGIC NUMBERS

All constants must either:
- Come from config
- Be defined at top of file
- Be explained inline

---

# 7️⃣ PROJECTION RULE

Projection functions must:

- Explicitly state which space input is in
- Explicitly state which space output is in
- Contain zero side effects

Must include comment like:

// WORLD → SCREEN conversion

---

# 8️⃣ RENDER RULE

Only worldRenderer may mutate:

- node.position()
- node.scale()
- batchDraw()

Every mutation must be commented:

// Apply projected screen position to Konva node

---

# 9️⃣ INTERACTION RULE

Interaction files must:

- Convert SCREEN → WORLD
- Mutate state
- Call render

They must not:
- Call projection directly except for inverse conversion
- Modify Konva permanently

---

# 🔟 EXAMPLE FUNCTION FORMAT

export function example() {
  // --------------------------------------------------
  // 🔎 SSOT REFERENCES
  // --------------------------------------------------
  const camera = appState.camera;

  // --------------------------------------------------
  // 🧮 STEP 1: Compute Derived Value
  // --------------------------------------------------
  const value = camera.zoom * 2;

  // --------------------------------------------------
  // 📤 STEP 2: Return Result
  // --------------------------------------------------
  return value;
}

---

# 11️⃣ NON-NEGOTIABLE

If formatting drifts:
- Rewrite the file.
- Do not patch inconsistently.
- Keep visual structure clean.

Consistency reduces cognitive load.