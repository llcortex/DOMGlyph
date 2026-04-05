# @domglyph/components (formerly [@cortexui/components](https://www.npmjs.com/package/@cortexui/components))

[![npm version](https://img.shields.io/npm/v/@domglyph/components?color=0ea5e9)](https://www.npmjs.com/package/@domglyph/components)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

React components with built-in AI contracts.

---

## Overview

`@domglyph/components` is the primary package for building DOMglyph interfaces. Every component in this package automatically outputs the correct `data-ai-*` attributes — no manual annotation required.

Pass in semantic props (`action`, `state`, `entityType`, etc.) and the component handles the contract. The result is an interface that is immediately inspectable by AI agents via `window.__DOMGLYPH__`.

---

## Installation

```bash
npm install @domglyph/components
```

Peer dependencies:

```bash
npm install react@^18 react-dom@^18
```

---

## Components

### ActionButton

A button that triggers an action. Renders with `data-ai-role="action"`, `data-ai-id`, `data-ai-action`, and `data-ai-state` automatically.

```tsx
import { ActionButton } from '@domglyph/components';

// Idle state — ready for interaction
<ActionButton action="save-profile" state="idle" label="Save Profile" />
// <button data-ai-role="action" data-ai-id="save-profile"
//         data-ai-action="save-profile" data-ai-state="idle">Save Profile</button>

// Loading state — async operation in progress
<ActionButton action="save-profile" state="loading" label="Save Profile" />
// <button data-ai-role="action" data-ai-id="save-profile"
//         data-ai-action="save-profile" data-ai-state="loading" disabled>Save Profile</button>

// Success state — operation completed
<ActionButton action="save-profile" state="success" label="Save Profile" />
// <button data-ai-role="action" data-ai-id="save-profile"
//         data-ai-action="save-profile" data-ai-state="success">Save Profile</button>

// Error state — operation failed
<ActionButton action="save-profile" state="error" label="Save Profile" />
// <button data-ai-role="action" data-ai-id="save-profile"
//         data-ai-action="save-profile" data-ai-state="error">Save Profile</button>

// Disabled
<ActionButton action="save-profile" state="disabled" label="Save Profile" />
// <button data-ai-role="action" data-ai-id="save-profile"
//         data-ai-action="save-profile" data-ai-state="disabled" disabled>Save Profile</button>
```

Full props:

```ts
interface ActionButtonProps {
  readonly action: string;       // verb-noun action name, becomes data-ai-action and data-ai-id
  readonly state: AIState;       // idle | loading | success | error | disabled
  readonly label: string;        // visible button text
  readonly section?: string;     // data-ai-section (optional)
  readonly onClick?: () => void;
}
```

---

### FormField

A labelled input field. Renders with `data-ai-role="field"`, `data-ai-id`, `data-ai-field-type`, and `data-ai-required` automatically.

```tsx
import { FormField } from '@domglyph/components';

<FormField
  id="user-email"
  fieldType="email"
  label="Email address"
  required
  state="idle"
/>
// <div data-ai-role="form" data-ai-id="user-email-field">
//   <label>Email address</label>
//   <input data-ai-role="field" data-ai-id="user-email"
//          data-ai-field-type="email" data-ai-required="true"
//          data-ai-state="idle" type="email" />
// </div>

// Error state with message
<FormField
  id="user-email"
  fieldType="email"
  label="Email address"
  required
  state="error"
  errorMessage="Please enter a valid email"
/>
```

---

### DataTable

A table of entity rows. Renders with `data-ai-role="table"`, `data-ai-entity`, and per-row `data-ai-entity-id` attributes.

```tsx
import { DataTable } from '@domglyph/components';

<DataTable
  entityType="order"
  columns={[
    { key: 'id', label: 'Order ID' },
    { key: 'status', label: 'Status' },
    { key: 'total', label: 'Total' },
  ]}
  rows={orders}
  getRowId={(row) => row.id}
/>
// <table data-ai-role="table" data-ai-entity="order">
//   <tbody>
//     <tr data-ai-entity="order" data-ai-entity-id="ord-001">...</tr>
//     <tr data-ai-entity="order" data-ai-entity-id="ord-002">...</tr>
//   </tbody>
// </table>
```

---

### StatusBanner

A read-only banner communicating system or operation status. Renders with `data-ai-role="status"` and `data-ai-state`.

```tsx
import { StatusBanner } from '@domglyph/components';

// Informational
<StatusBanner type="info" message="Your session expires in 5 minutes." />
// <div data-ai-role="status" data-ai-state="idle" data-ai-id="status-banner">...</div>

// Success
<StatusBanner type="success" message="Profile saved successfully." />
// <div data-ai-role="status" data-ai-state="success" data-ai-id="status-banner">...</div>

// Warning
<StatusBanner type="warning" message="Unsaved changes will be lost." />

// Error
<StatusBanner type="error" message="Failed to save. Please try again." />
// <div data-ai-role="status" data-ai-state="error" data-ai-id="status-banner">...</div>
```

---

### ConfirmDialog

A modal dialog requesting confirmation before a destructive or significant action. Renders with `data-ai-role="modal"` and child action buttons with named `data-ai-action` attributes.

```tsx
import { ConfirmDialog } from '@domglyph/components';

<ConfirmDialog
  id="delete-account-dialog"
  title="Delete account"
  description="This action cannot be undone. All your data will be permanently deleted."
  confirmAction="confirm-delete-account"
  cancelAction="cancel-delete-account"
  confirmLabel="Delete account"
  cancelLabel="Cancel"
  state="idle"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
// <div data-ai-role="modal" data-ai-id="delete-account-dialog" data-ai-state="idle">
//   ...
//   <button data-ai-role="action" data-ai-action="confirm-delete-account"
//           data-ai-id="confirm-delete-account" data-ai-state="idle">Delete account</button>
//   <button data-ai-role="action" data-ai-action="cancel-delete-account"
//           data-ai-id="cancel-delete-account" data-ai-state="idle">Cancel</button>
// </div>
```

---

## AI Contract

Every component in this package outputs the correct `data-ai-*` attributes automatically. You pass semantic props; the component handles the annotation.

When `ActionButton` with `action="save-profile"` is rendered, an AI agent can call:

```js
const actions = window.__DOMGLYPH__.getAvailableActions();
// [
//   {
//     id: "save-profile",
//     action: "save-profile",
//     state: "idle",
//     section: null
//   }
// ]
```

The agent can then act deterministically:

```js
document.querySelector('[data-ai-id="save-profile"]').click();
```

No selector guessing. No text parsing. No fragile heuristics.

---

## Part of DOMglyph

`@domglyph/components` is part of the [DOMglyph](../../README.md) design system.

- [Main repository](../../README.md)
- [Documentation](http://localhost:3001/docs/components)
- [Contributing](../../CONTRIBUTING.md)

---

## ☕ Support

If you find DOMglyph useful, you can support the project:

👉 https://buymeacoffee.com/nishchya

It helps keep the project alive and growing.
