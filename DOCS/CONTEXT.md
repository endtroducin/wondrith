# Wondrith – Project Context

## Overview

Wondrith is a spatial task management system designed for ADHD-friendly interaction.

Instead of traditional task lists, ideas and tasks exist inside a **2.5D world space** rendered with **PixiJS (WebGL)**.

The interface emphasizes **kinesthetic interaction**, allowing users to organize ideas through **movement and spatial relationships rather than form entry**.

---

# Core Concept

The world is divided into three zones:

IDEA SKY
Clouds representing ideas

CONVERSION BAND
Where ideas become tasks

TASK CITY
Towers representing actionable tasks

---

# Object Types

## Ideas

Ideas are represented as **clouds**.

Properties:

- flexible
- exploratory
- non-actionable

Clouds exist **above the conversion band**.

---

## Tasks

Tasks are represented as **towers / buildings**.

Properties:

- actionable
- grounded
- structured

Towers exist **below the conversion band**.

Tower height represents **task difficulty**.

---

# Conversion System

Ideas become tasks by **dragging clouds through the conversion band**.

Cloud → Conversion Band → Tower

Future animation:

cloud condenses → rain → tower grows

---

# Kinesthetic Data Entry

Wondrith avoids traditional metadata entry.

Instead, information is captured through **movement and interaction**.

Examples:

- dragging ideas
- repositioning objects
- crossing motivation columns
- repeated movement patterns

This approach reduces cognitive friction and supports ADHD workflows.

---

# Motivation Columns

Inside the conversion band are vertical columns.

Each column represents a **motivation type** such as:

- Fun
- Reward
- Identity
- Purpose
- Habit

When a cloud is dragged through a column during conversion:

idea → column → task

the resulting task inherits that motivation tag.

---

# Spatial Layout

World space uses a simple coordinate system.

x → horizontal movement  
y → world depth / vertical organization  
z → height (used for tower difficulty)

Example:

cloud
x = 200
y = -200
z = 0

tower
x = 200
y = 200
z = difficulty

---

# Rendering Engine

The renderer uses **PixiJS**.

Pixi provides:

- GPU acceleration
- WebGL rendering
- efficient object batching
- animation support

---

# Architecture Principles

## Single Source of Truth

All data lives inside:

appState

Example:

appState = {
  ideas: [],
  tasks: [],
  camera: {},
  world: {}
}

Renderers read from this state.

Interactions mutate this state.

---

## Renderer Separation

Rendering is purely visual.

Renderers:

- do not contain business logic
- do not mutate application state

---

## Interaction Controllers

Interaction modules handle:

- dragging
- selection
- conversion detection

These modules mutate `appState`.

---

# Current Development State

The prototype currently renders:

- world grid
- simple cloud
- simple tower

This verifies the Pixi rendering pipeline.

---

# Immediate Next Milestones

1. Dragging system for clouds
2. Conversion band detection
3. Cloud → tower transformation
4. Motivation column detection
5. Camera movement between zones

---

# Future Systems (Not Immediate)

These are ideas but not part of the current milestone:

- cloud weather types
- impossible geometry for difficulty
- tower distortion traits
- idea condensation animation
- dopamine feedback effects