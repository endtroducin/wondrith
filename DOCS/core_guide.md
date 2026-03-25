Here’s a paste-ready rules file for Continue.

Use it as something like:

.continue/rules/wondrith-code-guide.md

# Wondrith Code Guide

This project is a Pixi.js task application with game-like interactions, camera navigation, dragging, and a single-source-of-truth architecture.

The goal of this guide is to ensure generated code stays readable, maintainable, and easy for a human to understand while iterating.

The assistant must optimize for:
- clarity over cleverness
- small understandable edits over large rewrites
- comments throughout the code, not only at the top
- logical separation of concerns without scattering one feature across too many files

---

## Core Principles

1. The app uses a **single source of truth**.
2. Canonical app data lives in `src/core/`.
3. Rendering is derived from state and should remain as dumb as possible.
4. Input/controller code should translate user intent into state updates.
5. Camera, projection, and Pixi bootstrapping should stay thin and stable.
6. Prefer organizing code by **what changes together** rather than only by technical category.
7. Avoid giant code dumps that are hard to inspect.
8. Prefer extending an existing nearby file before creating a new one.

---

## Preferred Folder Structure

Use this structure as the default mental model when generating or refactoring code:

```txt
src/
  core/
    appState.js
    actions.js
    selectors.js
    cardSchema.js
    styles.js
    config.js

  world/
    worldBuilder.js
    worldLayout.js
    worldQueries.js

  cards/
    cardFactory.js
    cardViewModel.js
    cardRenderer.js
    cardInteractions.js

  input/
    pointerController.js
    dragController.js
    hitTest.js

  viewport/
    camera.js
    projection.js
    navigation.js

  render/
    pixiApp.js
    sceneRenderer.js
    gridRenderer.js
    debugRenderer.js

  utils/
    math.js
    ids.js
    bounds.js


⸻

Responsibility Rules

src/core/

Owns:
	•	canonical app state
	•	actions and state update rules
	•	selectors and derived data helpers
	•	card schema and defaults
	•	style tokens and design constants
	•	app-level config

Does not own:
	•	Pixi display object creation
	•	direct rendering logic
	•	pointer event wiring
	•	camera math

src/world/

Owns:
	•	world construction
	•	world layout rules
	•	world queries and spatial helpers tied to world meaning

Does not own:
	•	canonical card schema
	•	Pixi bootstrapping
	•	generic pointer plumbing

src/cards/

Owns:
	•	card creation helpers
	•	card view-model shaping
	•	card-specific interactions
	•	card rendering helpers

Does not own:
	•	app-wide state orchestration
	•	camera math
	•	global Pixi scene setup

src/input/

Owns:
	•	pointer handling
	•	drag lifecycle handling
	•	hit testing
	•	translating user input into actions/state updates

Does not own:
	•	core business rules
	•	rendering decisions
	•	long-term data storage

src/viewport/

Owns:
	•	camera state and math
	•	projection math
	•	navigation behavior related to viewing the world

Does not own:
	•	card schema
	•	drag business rules
	•	rendering ownership

src/render/

Owns:
	•	Pixi application setup
	•	display object synchronization
	•	scene drawing and redraw flow
	•	purely visual updates

Does not own:
	•	canonical app state
	•	business logic
	•	hidden state mutations
	•	schema decisions

⸻

File Creation Rules

When generating code:
	1.	Prefer editing the smallest understandable unit.
	2.	Do not create a new file unless it clearly reduces conceptual burden.
	3.	Do not split one behavior across many top-level folders without a strong reason.
	4.	Do not create generic dumping-ground files such as:
	•	helpers.js
	•	misc.js
	•	constants.js
	•	utils.js inside feature folders unless the purpose is very clear
	5.	If a new file is created, its name must reveal its responsibility.

Good:
	•	cardViewModel.js
	•	worldQueries.js
	•	dragController.js
	•	projection.js

Avoid:
	•	manager.js
	•	common.js
	•	sharedHelpers.js
	•	dataProcessor.js

⸻

Code Generation Rules

When writing or editing code:
	1.	Do not rewrite an entire file unless necessary.
	2.	Prefer targeted edits over broad rewrites.
	3.	Keep functions small and named by intent.
	4.	Use pure functions where possible.
	5.	Keep parameter counts low.
	6.	Make mutations explicit.
	7.	Do not hide important logic inside vague helpers.
	8.	Avoid introducing abstraction unless it reduces future editing cost.
	9.	Generate code that a human can read top-to-bottom without guessing what happened.

The assistant must avoid producing giant uninterrupted blocks of code.

⸻

Mandatory Commenting Style

Every generated file must include:
	1.	a file header block
	2.	section header comments throughout the file
	3.	inline comments for non-obvious logic
	4.	function comments for important public functions
	5.	comments that explain intent, assumptions, and boundaries

Comments must explain:
	•	what this section is responsible for
	•	why this logic exists
	•	what assumptions it makes
	•	which layer should own the behavior
	•	what is intentionally not handled here

Comments must not merely restate syntax.

Bad:

// Set x
sprite.x = x;

Good:

// Keep the sprite anchored to world-space coordinates so camera zoom
// changes visual scale without changing the card's logical position.
sprite.x = x;


⸻

Required File Header Format

Every file must begin with this exact style:

// ==================================================
// 📍 src/core/cardSchema.js
// ==================================================
// 🧩 CARD SCHEMA
//
// Defines the canonical structure for task cards.
//
// Responsible for:
// • default card shape
// • validation helpers
// • schema-related defaults
//
// This file does NOT:
// • render cards
// • manage pointer interactions
// • mutate Pixi display objects
//
// ==================================================

The assistant must adapt:
	•	the file path
	•	the title
	•	the responsibility bullets
	•	the non-responsibility bullets

Do not omit this header.

⸻

Required Section Header Format

Use section headers throughout every non-trivial file:

// --------------------------------------------------
// Imports
// --------------------------------------------------

// --------------------------------------------------
// Private helpers
// --------------------------------------------------

// --------------------------------------------------
// Public API
// --------------------------------------------------

Use section headers to break up:
	•	imports
	•	constants/config
	•	selectors
	•	private helpers
	•	state updates
	•	event wiring
	•	rendering sync
	•	cleanup
	•	exports

⸻

Function Documentation Rules

Important functions should use brief doc comments:

/**
 * Build a render-friendly card view model from canonical app state.
 *
 * This keeps renderer code simple and prevents render layers from
 * depending directly on the raw state shape.
 */
export function createCardViewModel(card, appState) {
  // ...
}

Function naming rules:
	•	prefer names that reveal intent
	•	be explicit about mutation
	•	be explicit about the domain object

Good:
	•	createCardViewModel
	•	updateDraggedCardPosition
	•	selectVisibleCards
	•	syncCardSprite
	•	buildWorldLayout

Avoid:
	•	handleThing
	•	processData
	•	updateStuff
	•	runLogic
	•	manageCards

⸻

State Management Rules

Because this app uses a single source of truth:
	1.	Canonical world/card/task data must live in src/core/appState.js or closely related core files.
	2.	Render objects are derived artifacts, never the canonical source.
	3.	Temporary interaction state may live outside canonical state only if clearly labeled and justified.
	4.	Derived values should come from selectors or explicit view-model builders.
	5.	Do not duplicate schema fields across state and render layers.
	6.	Keep business logic out of Pixi display objects.

⸻

Rendering Rules

Renderers should be as dumb as possible.

Preferred renderer flow:
	1.	read state
	2.	derive view model if needed
	3.	create or sync display objects
	4.	remove stale display objects
	5.	return cleanup/update hooks if necessary

Renderers must not:
	•	invent business rules
	•	mutate canonical state
	•	hide drag logic inside draw code
	•	contain app-specific schema ownership

⸻

Input and Drag Rules

Pointer and drag logic should:
	•	read interaction state
	•	determine user intent
	•	dispatch state updates
	•	request visual sync as needed

They should not mix all of the following in one function:
	•	hit testing
	•	business rules
	•	rendering mutations
	•	persistence
	•	camera projection logic

Keep input code narrow and easy to trace.

⸻

Viewport Rules

Camera and projection files should stay stable and technical.

They should:
	•	convert between coordinate spaces
	•	manage pan/zoom/navigation state
	•	expose clear utility functions

They should not:
	•	know card schema
	•	know task business rules
	•	decide drag/drop outcomes
	•	own rendering behavior

⸻

Style and Schema Rules

styles.js and cardSchema.js belong in src/core/.

Reason:
	•	styles are part of the app’s design system
	•	schema is part of the app’s canonical meaning
	•	neither should live in a generic constants/ folder

Avoid a generic constants/ directory unless there is a very narrow and justified purpose.

⸻

Editing Rules

When editing existing code:
	1.	preserve the existing file header format
	2.	preserve existing section headers where reasonable
	3.	keep the change local unless a broader change is required
	4.	add comments to newly introduced logic
	5.	do not silently restructure unrelated parts of the file
	6.	do not replace understandable code with abstraction unless there is clear benefit
	7.	prefer incremental refactors over architectural rewrites

⸻

Output Style Requirements For The Assistant

When generating code, always:
	•	preserve the file header
	•	add section headers
	•	add inline reasoning comments throughout
	•	prefer small, understandable functions
	•	keep rendering dumb
	•	keep state central
	•	keep feature logic close to where it changes

The assistant must not:
	•	output huge monolithic code blocks with only one top comment
	•	create unnecessary files
	•	spread one feature across many folders without reason
	•	move logic into vague helpers just to make files shorter
	•	generate architecture astronauts’ code

⸻

Preferred Decision Rule

Before placing logic, ask:

Is this file primarily responsible for truth, behavior, or drawing?
	•	truth → core/
	•	behavior → domain folder such as cards/, world/, input/, viewport/
	•	drawing → render/

Use that rule when uncertain.

⸻

Preferred Coding Tone

Generated code should feel like:
	•	deliberate
	•	readable
	•	inspectable
	•	practical
	•	well-labeled
	•	easy for a solo developer to extend

Do not optimize for cleverness.
Optimize for maintainability.

⸻

Example: Too Thin

Avoid this style:

export function updateDrag(state, pointer) {
  const item = state.items[state.draggingId];
  item.x = pointer.x;
  item.y = pointer.y;
}


⸻

Example: Preferred

Prefer this style:

// --------------------------------------------------
// Drag updates
// --------------------------------------------------

/**
 * Move the actively dragged card using world-space pointer coordinates.
 *
 * We update canonical state here because card position is part of the
 * application's source of truth. The renderer should only reflect this
 * value rather than storing a separate visual position.
 */
export function updateDraggedCardPosition(state, pointerWorld) {
  const draggedCard = state.cards[state.draggingCardId];

  // Guard against partial drag teardown where the drag flag exists
  // but the card reference has already been cleared.
  if (!draggedCard) {
    return;
  }

  // Store the position in world space so camera pan and zoom affect
  // presentation only, not the logical placement of the card.
  draggedCard.x = pointerWorld.x;
  draggedCard.y = pointerWorld.y;
}


⸻

Final Instruction To The Assistant

Prefer modifying or generating the smallest understandable unit of code.

Avoid large uninterrupted code blocks.

Use section comments and inline reasoning comments throughout the file so a human can follow the logic while reading top to bottom.

Before creating a new file, prefer extending an existing nearby file unless the new file removes a clear conceptual burden.

Here’s a tighter add-on prompt you can also place in Continue’s system message or project instructions:

```txt
Generate code in small, inspectable sections. Do not dump large monolithic implementations. Preserve the file header format, add section headers throughout, and comment non-obvious logic inline. Prefer extending nearby files over creating new ones. Keep canonical state in core, keep renderers dumb, and keep camera/projection/input logic narrow and stable.

And here’s the one structural recommendation I’d stick with for now:

src/
  core/
  world/
  cards/
  input/
  viewport/
  render/
  utils/

That gives you separation without forcing every feature to fan out across too many folders.

I can also turn this into a shorter “LLM rules only” version optimized for smaller Ollama context windows.