> **DOMglyph is now DOMglyph.** This package (`@domglyph/ai-contract`) is no longer maintained. All future updates are published under [`@domglyph/ai-contract`](https://www.npmjs.com/package/@domglyph/ai-contract). Please migrate to the new package.

---

# @domglyph/ai-contract

[![npm version](https://img.shields.io/npm/v/@domglyph/ai-contract?color=0ea5e9)](https://www.npmjs.com/package/@domglyph/ai-contract)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

The machine-readable interface specification for DOMglyph (now DOMglyph).

---

## Overview

`@domglyph/ai-contract` is the foundation of the DOMglyph system. It defines:

- The complete `data-ai-*` attribute specification as string constants
- TypeScript types for every role, state, event, and attribute map
- Runtime validation utilities (`validateAIAttributes`, `extractAIAttributes`)
- Event type definitions for the DOMglyph event log

All other DOMglyph packages depend on this package as their source of truth. It has no runtime dependencies and is safe to use in any environment — browser, Node.js, or test runner.

---

## Installation

```bash
npm install @domglyph/ai-contract
```

---

## The Attributes

| Attribute | Description |
|---|---|
| `data-ai-id` | Stable unique identifier for the element. Used by agents to target a specific element across renders. |
| `data-ai-role` | The semantic role of the element. One of the 9 defined roles (see below). |
| `data-ai-action` | The verb-noun action name for action elements (e.g. `save-profile`, `delete-order`). |
| `data-ai-state` | The current interactive state of the element. One of the 7 defined states (see below). |
| `data-ai-screen` | The name of the screen or page this element belongs to. |
| `data-ai-section` | The named section within a screen (e.g. `billing`, `profile`, `header`). |
| `data-ai-entity` | The entity type this element represents or operates on (e.g. `user`, `order`, `product`). |
| `data-ai-entity-id` | The specific instance ID of the entity (e.g. a user ID or order number). |
| `data-ai-field-type` | The input type for field elements. One of: `text`, `email`, `password`, `number`, `select`, `checkbox`. |
| `data-ai-required` | Whether a field is required. `"true"` or `"false"`. |
| `data-ai-label` | A human-readable label for the element, used when the visible text is insufficient or absent. |

---

## Roles

The `data-ai-role` attribute identifies what kind of element this is:

| Role | Description |
|---|---|
| `action` | An element that triggers an action when activated (button, link, etc.) |
| `field` | A data entry element (input, select, textarea) |
| `form` | A container grouping related fields and a submission action |
| `table` | A data grid or tabular list of entities |
| `modal` | A dialog or overlay requiring user attention |
| `nav-item` | A navigation element (menu item, tab, breadcrumb link) |
| `status` | A read-only element communicating system or entity status |
| `screen` | The root container of the current screen or page |
| `section` | A named sub-region of a screen |

---

## States

The `data-ai-state` attribute communicates the current interaction state:

| State | Description |
|---|---|
| `idle` | Element is ready and interactive |
| `loading` | Element is waiting for an async operation to complete |
| `success` | The most recent operation completed successfully |
| `error` | The most recent operation failed, or the element has a validation error |
| `disabled` | Element is present but not currently interactive |
| `expanded` | Element is in an open/expanded state (e.g. dropdown, accordion) |
| `selected` | Element is in an active/selected state (e.g. tab, list item) |

---

## Events

DOMglyph components emit structured events that are captured in the runtime event log.

| Event | Description | Key Payload Fields |
|---|---|---|
| `action_triggered` | An action element was activated | `actionId`, `timestamp` |
| `action_completed` | The action completed successfully | `actionId`, `result: 'success'`, `timestamp` |
| `action_failed` | The action failed | `actionId`, `result: 'error'`, `message`, `timestamp` |
| `form_submitted` | A form was submitted | `formId`, `timestamp` |
| `field_updated` | A field value changed | `fieldId`, `timestamp` |

TypeScript event types:

```ts
type AIEventType =
  | 'action_triggered'
  | 'action_completed'
  | 'action_failed'
  | 'form_submitted'
  | 'field_updated';

interface RuntimeEventLogEntry {
  type: AIEventType;
  actionId?: string;
  formId?: string;
  fieldId?: string;
  result?: 'success' | 'error';
  message?: string;
  timestamp: number;
}
```

---

## Usage

### Attribute constants

Import attribute name constants to avoid magic strings:

```ts
import {
  DATA_AI_ROLE,
  DATA_AI_STATE,
  DATA_AI_ACTION,
  DATA_AI_ID,
  DATA_AI_ENTITY,
  DATA_AI_ENTITY_ID,
  DATA_AI_FIELD_TYPE,
  DATA_AI_REQUIRED,
  DATA_AI_SCREEN,
  DATA_AI_SECTION,
} from '@domglyph/ai-contract';

// Use in React components:
<button
  {...{ [DATA_AI_ROLE]: 'action', [DATA_AI_ID]: 'save', [DATA_AI_STATE]: 'idle' }}
>
  Save
</button>
```

### Validation

Validate that a DOM element has a correct and complete AI contract:

```ts
import { validateAIAttributes } from '@domglyph/ai-contract';

const result = validateAIAttributes(element);
// {
//   valid: boolean,
//   errors: string[],
//   attributes: AIAttributeMap
// }

if (!result.valid) {
  console.error('AI contract violations:', result.errors);
}
```

### Extracting attributes

Read all `data-ai-*` attributes from a DOM element as a typed object:

```ts
import { extractAIAttributes } from '@domglyph/ai-contract';

const attrs = extractAIAttributes(element);
// {
//   id: 'save-profile',
//   role: 'action',
//   action: 'save-profile',
//   state: 'idle',
//   screen: 'profile',
//   section: 'contact-info',
//   entity: null,
//   entityId: null,
//   fieldType: null,
//   required: null
// }
```

### TypeScript types

Key types exported from this package:

```ts
type AIRole =
  | 'action'
  | 'field'
  | 'form'
  | 'table'
  | 'modal'
  | 'nav-item'
  | 'status'
  | 'screen'
  | 'section';

type AIState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'disabled'
  | 'expanded'
  | 'selected';

type AIEvent =
  | 'action_triggered'
  | 'action_completed'
  | 'action_failed'
  | 'form_submitted'
  | 'field_updated';

interface AIAttributeMap {
  readonly id: string | null;
  readonly role: AIRole | null;
  readonly action: string | null;
  readonly state: AIState | null;
  readonly screen: string | null;
  readonly section: string | null;
  readonly entity: string | null;
  readonly entityId: string | null;
  readonly fieldType: string | null;
  readonly required: boolean | null;
}
```

---

## Part of DOMglyph

`@domglyph/ai-contract` is part of the [DOMglyph](../../README.md) design system.

- [Main repository](../../README.md)
- [Documentation](http://localhost:3001/docs/ai-contract)
- [Contributing](../../CONTRIBUTING.md)

---

## ☕ Support

If you find DOMglyph useful, you can support the project:

👉 https://buymeacoffee.com/nishchya

It helps keep the project alive and growing.
