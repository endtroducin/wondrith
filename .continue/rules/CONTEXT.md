---
name: Project Context
---
# Information about this project...

# CONTEXT.md
# Spatial Engine — Authoritative Project Context

This file defines the non-negotiable architecture and mental model for this project.

Any generated code must conform to this document.

If code violates these rules, it is wrong.

---

# 1️⃣ Project Summary

This project is a deterministic spatial UI engine.

The world exists in fixed coordinates.
The camera moves.
The renderer projects world → screen.
Konva only draws.

The world never moves.
The camera never directly moves Konva nodes.
Projection is pure math.

---

# 2️⃣ Core Design Principle

WORLD SPACE IS FIXED.

Navigation is achieved by mutating camera state and re-rendering.

We DO NOT:
- Move worldGroup
- Scale worldGroup
- Apply nested Konva transforms
- Use hidden transform stacks
- Mix camera math inside Konva transforms

All transforms are explicit via projection.

---

# 3️⃣ Domain Structure

Each folder answers exactly one question.

## core/
What exists?
- appState.js
- config.js

Contains:
- world state
- camera state
- global config

Contains no logic.

---

## math/
How do coordinates convert?

- projection.js

Must be PURE functions.
No state mutation.
No Konva usage.
No side effects.

---

## camera/
What part of world is visible?

- cameraBounds.js
- cameraController.js

May:
- Mutate camera state
- Derive bounds

May NOT:
- Touch Konva
- Render anything

---

## render/
How do we draw?

- worldRenderer.js (ONLY file allowed to mutate Konva)
- primitives/
  - cards.js
  - grid.js
  - zones.js
  - shadows.js
- debug/

Only worldRenderer.js may:
- Set node.position()
- Set node.scale()
- Call batchDraw()

Renderers:
- Read state
- Use projection
- Never mutate world or camera

---

## interaction/
How does input change state?

- dragController.js
- panController.js
- zoomController.js
- pointerController.js
- zoneDetection.js

Interaction may:
- Mutate world coordinates
- Mutate camera
- Then call render

Interaction may NOT:
- Directly move Konva nodes permanently
- Contain projection math
- Contain rendering logic

---

## persistence/
How do we save/load state?

- pouch.js

May:
- Save card data
- Load card data

May NOT:
- Render
- Modify camera
- Contain UI logic

---

# 4️⃣ Data Flow (Unidirectional)

Interaction → Mutate State → Render

Camera Change → Mutate Camera → Render

Resize → Update Canvas → Update Bounds → Render

Nothing else may cause drawing.

---

# 5️⃣ World Model

All entities exist in world coordinates:

{
  x: number,
  y: number,
  z: number
}

These values:
- Never change due to zoom
- Never change due to pan
- Only change when explicitly moved

World coordinates are absolute truth.

---

# 6️⃣ Camera Model

Camera contains:

{
  x,
  y,
  zoom,
  height,
  bounds
}

Camera:
- Defines viewport position
- Defines magnification
- Does NOT modify world
- Does NOT move Konva nodes directly

---

# 7️⃣ Projection Model

Projection converts:

world → screen
screen → world

Projection must be PURE.

It:
- Accepts world position + camera
- Returns screen values
- Has zero side effects

Example mental model:

screenX = (worldX - camera.x) * scale
screenY = (worldY - camera.y) * scale

Scale may incorporate z for 2.5D perspective.

---

# 8️⃣ Konva's Role

Konva is a drawing engine.

It:
- Maintains scene graph
- Handles pointer events
- Draws shapes

It does NOT:
- Understand world space
- Understand camera
- Perform projection
- Manage spatial logic

Konva only receives screen coordinates.

---

# 9️⃣ Rendering Contract

Only worldRenderer.js may mutate:

- node.position()
- node.scale()
- batchDraw()

No other file may perform these operations.

---

# 🔟 Non-Negotiable Rules

1. World space is fixed.
2. Camera moves — world does not.
3. Projection is pure.
4. Only worldRenderer mutates Konva.
5. Domains must not leak responsibilities.
6. No hidden transforms.
7. No duplicate projection systems.
8. No mixing screen-space logic into world state.

If any of these are violated, the code must be refactored.

---

# 11️⃣ Engineering Goal

Build a stable 2D/2.5D spatial engine that can be locked and not revisited.

Once stable:
- Stop touching math
- Stop touching camera
- Stop touching renderer
- Build features on top

The engine must feel deterministic and calm.