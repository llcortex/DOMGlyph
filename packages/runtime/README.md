# @domglyph/runtime (formerly [@cortexui/runtime](https://www.npmjs.com/package/@cortexui/runtime))

[![npm version](https://img.shields.io/npm/v/@domglyph/runtime?color=0ea5e9)](https://www.npmjs.com/package/@domglyph/runtime)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

The browser runtime that makes DOMglyph pages inspectable by AI agents.

---

## Overview

`@domglyph/runtime` installs `window.__DOMGLYPH__` — a structured inspection API that AI agents use instead of scraping the DOM.

Without this runtime, an AI agent visiting your page would need to traverse the DOM, parse CSS, infer intent from visible text, and guess at state. With this runtime, the agent calls a single function and gets back a typed, structured description of exactly what is on screen and what can be done.

The runtime works by reading the `data-ai-*` attributes that DOMglyph components emit. It requires no separate data store, no backend, and no framework integration beyond a single `installDOMglyphRuntime()` call.

---

## Installation

```bash
npm install @domglyph/runtime
```

---

## Setup

### With React (recommended)

Call `installDOMglyphRuntime` once in your application's entry point, before the app renders:

```tsx
import { installDOMglyphRuntime } from '@domglyph/runtime';

// Install before rendering
installDOMglyphRuntime(window);

// Then render your app
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

### Verifying installation

Open the browser console on any DOMglyph page and run:

```js
console.log(window.__DOMGLYPH__.getScreenContext());
```

If `__DOMGLYPH__` is defined and returns a context object, the runtime is installed correctly.

---

## API Reference

### getScreenContext()

Returns the screen-level context for the current page view. This is the first thing an agent should call to orient itself.

```ts
getScreenContext(): {
  screen: string | null;      // value of data-ai-screen on the root element
  entity: string | null;      // value of data-ai-entity on the screen root
  entityId: string | null;    // value of data-ai-entity-id on the screen root
  sections: string[];         // all data-ai-section values present on this screen
}
```

Example output:

```js
window.__DOMGLYPH__.getScreenContext();
// {
//   screen: "order-detail",
//   entity: "order",
//   entityId: "ord-9142",
//   sections: ["summary", "line-items", "shipping", "actions"]
// }
```

---

### getAvailableActions()

Returns every element with `data-ai-role="action"` that is currently rendered and not in a `disabled` state. This tells the agent what it can do right now.

```ts
getAvailableActions(): Array<{
  id: string;             // data-ai-id
  action: string;         // data-ai-action
  state: string;          // data-ai-state
  section: string | null; // data-ai-section (if present)
}>
```

Example output:

```js
window.__DOMGLYPH__.getAvailableActions();
// [
//   { id: "approve-order", action: "approve-order", state: "idle", section: "actions" },
//   { id: "cancel-order",  action: "cancel-order",  state: "idle", section: "actions" },
//   { id: "edit-shipping", action: "edit-shipping",  state: "idle", section: "shipping" }
// ]
```

---

### getFormSchema(formId)

Returns the field schema for a form identified by its `data-ai-id`. Returns `null` if no matching form is found.

```ts
getFormSchema(formId: string): {
  formId: string;
  fields: Array<{
    id: string;                  // data-ai-id of the field
    fieldType: string;           // data-ai-field-type
    required: boolean;           // data-ai-required
    currentValue: string | null; // current input value
    state: string;               // data-ai-state of the field
  }>;
} | null
```

Example output:

```js
window.__DOMGLYPH__.getFormSchema('edit-shipping-form');
// {
//   formId: "edit-shipping-form",
//   fields: [
//     { id: "shipping-name",    fieldType: "text",   required: true,  currentValue: "Jane Smith", state: "idle" },
//     { id: "shipping-address", fieldType: "text",   required: true,  currentValue: "",           state: "error" },
//     { id: "shipping-country", fieldType: "select", required: true,  currentValue: "US",         state: "idle" }
//   ]
// }
```

---

### getVisibleEntities()

Returns all elements carrying `data-ai-entity` that are currently in the viewport. Useful for understanding what data the user can see.

```ts
getVisibleEntities(): Array<{
  entity: string;         // data-ai-entity
  entityId: string | null; // data-ai-entity-id
  section: string | null;  // data-ai-section
}>
```

Example output:

```js
window.__DOMGLYPH__.getVisibleEntities();
// [
//   { entity: "order",   entityId: "ord-9142", section: "summary" },
//   { entity: "product", entityId: "prd-001",  section: "line-items" },
//   { entity: "product", entityId: "prd-007",  section: "line-items" }
// ]
```

---

### getRecentEvents()

Returns a log of recent interaction events in chronological order. Use this to verify that an action completed, or to understand what has happened on screen since the last check.

```ts
getRecentEvents(): Array<{
  type: 'action_triggered' | 'action_completed' | 'action_failed' | 'form_submitted' | 'field_updated';
  actionId?: string;
  formId?: string;
  fieldId?: string;
  result?: 'success' | 'error';
  message?: string;
  timestamp: number;
}>
```

Example output:

```js
window.__DOMGLYPH__.getRecentEvents();
// [
//   { type: "action_triggered", actionId: "approve-order", timestamp: 1711900000000 },
//   { type: "action_completed", actionId: "approve-order", result: "success", timestamp: 1711900000250 }
// ]
```

---

## Devtools

In development, you can install the extended devtools runtime for additional inspection capabilities:

```ts
import { installDOMglyphDevtools } from '@domglyph/runtime';

installDOMglyphDevtools(window);
// window.__DOMGLYPH_DEVTOOLS__ is now available
```

The devtools runtime adds:

- Full DOM node references in query results
- Attribute validation warnings in the console
- A mutation observer log showing when `data-ai-*` attributes change

Do not install devtools in production builds.

---

## Using with AI Agents

A typical agent interaction loop using the DOMglyph runtime:

```js
// Step 1: Orient — where am I and what entity am I looking at?
const ctx = window.__DOMGLYPH__.getScreenContext();
// { screen: "profile", entity: "user", entityId: "usr-42", sections: [...] }

// Step 2: Survey — what actions can I take right now?
const actions = window.__DOMGLYPH__.getAvailableActions();
// [{ id: "save-profile", action: "save-profile", state: "idle", section: "contact" }]

// Step 3: Act — trigger the desired action deterministically
document.querySelector(`[data-ai-id="${actions[0].id}"]`).click();

// Step 4: Verify — did it work?
const events = window.__DOMGLYPH__.getRecentEvents();
// [{ type: "action_completed", actionId: "save-profile", result: "success", ... }]
```

This pattern is stable across re-renders, redesigns, and component updates. As long as the component exports the same `data-ai-action`, the agent's code does not need to change.

---

## Part of DOMglyph

`@domglyph/runtime` is part of the [DOMglyph](../../README.md) design system.

- [Main repository](../../README.md)
- [Documentation](http://localhost:3001/docs/runtime)
- [Contributing](../../CONTRIBUTING.md)

---

## ☕ Support

If you find DOMglyph useful, you can support the project:

👉 https://buymeacoffee.com/nishchya

It helps keep the project alive and growing.
