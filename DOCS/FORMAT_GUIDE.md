# Wondrith Code Format Guide

This project follows strict formatting and documentation rules.

These rules exist so the codebase remains readable and maintainable.

AI assistants must follow this format when generating code.

---

# File Structure

src

core
appState.js

world
worldBuilder.js
objectFactory.js

render
sceneRenderer.js
gridRenderer.js

interaction
pointerController.js
dragController.js

camera
cameraController.js

constants
styles.js

---

# File Header Format

Every file must begin with a clear header block.

Example:

```javascript
// ==================================================
// 📍 src/world/objectFactory.js
// ==================================================
// 🏗 OBJECT FACTORY
//
// Responsible for creating world objects such as:
//
// • clouds (ideas)
// • towers (tasks)
//
// This file does NOT:
// • render objects
// • mutate global state directly
//
// ==================================================


⸻

Section Headers

Each major section must use a divider header.

Example:

/* ============================================================
   🌩 CREATE CLOUD
============================================================ */


⸻

Comment Requirements

Every line of logic must include a comment.

This is extremely important.

The goal is to make the code understandable to developers who may not be familiar with WebGL or PixiJS.

Example:

// create new Pixi graphics object
const cloud = new PIXI.Graphics()

// begin fill color
cloud.beginFill(0xffffff)

// draw capsule cloud shape
cloud.drawRoundedRect(-60, -20, 120, 40, 20)

// end fill operation
cloud.endFill()

No block of logic should exist without comments explaining it.

⸻

Naming Conventions

Use descriptive names.

Preferred:

createCloud
createTower
detectConversionBand

Avoid vague names:

doThing
handleStuff

⸻

Rendering Rules

Renderers:

• read from appState
• never mutate state
• never contain business logic

⸻

State Mutation Rules

Only controllers or actions may mutate appState.

Example modules:

dragController
pointerController
taskActions

⸻

Camera Rules

Camera position lives in:

appState.camera

Renderers read camera values but do not modify them.

⸻

World Objects

All world objects should be stored in structured collections.

Example:

appState.ideas
appState.tasks

Each object contains:

id
position
metadata

⸻

Example Object Structure

{
  id: "idea-1",
  type: "idea",

  position: {
    x: 200,
    y: -300,
    z: 0
  },

  difficulty: 2,
  motivation: []
}


⸻

Rendering Flow

The renderer performs the following sequence:
	1.	read world state
	2.	update object positions
	3.	draw world objects
	4.	render frame

⸻

Important Principle

The codebase should remain:

simple
predictable
well commented

If a developer can read the code and immediately understand the system, the format guide is working.

---

# Important Addition We Made

You specifically asked to include:

> **comments on every line**

That rule is now explicitly in the guide:

Every line of logic must include a comment

This prevents the **three.js situation** where the code worked but was impossible to understand.

---

# What This Gives You

With these two files:

A new assistant will instantly understand:

- your **metaphor**
- your **architecture**
- your **coding style**
- your **comment expectations**
- your **current milestone**

Which means you can immediately ask:

> Help me implement cloud dragging and conversion band detection.

…and they won’t try to redesign the entire system.

---

If you'd like, I can also give you one **extremely useful third file** most projects like this have:

**`ARCHITECTURE.md`**

It visually explains how

appState
interaction
rendering
camera

all connect together — which makes onboarding **much easier for both humans and AI.**