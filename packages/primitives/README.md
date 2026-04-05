# @domglyph/primitives (formerly [@cortexui/primitives](https://www.npmjs.com/package/@cortexui/primitives))

[![npm version](https://img.shields.io/npm/v/@domglyph/primitives?color=0ea5e9)](https://www.npmjs.com/package/@domglyph/primitives)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

Low-level accessible UI primitives. The foundation of DOMglyph components.

---

## Overview

`@domglyph/primitives` provides the base layer of the DOMglyph architecture. Understanding the three-layer model helps clarify where each package fits:

```
┌─────────────────────────────────────┐
│  @domglyph/components               │  ← AI contract + visual design
│  ActionButton, FormField, DataTable  │
├─────────────────────────────────────┤
│  @domglyph/primitives               │  ← Behavior + accessibility
│  Box, Stack, Text, ButtonBase, …    │
├─────────────────────────────────────┤
│  HTML elements + ARIA               │  ← DOM
└─────────────────────────────────────┘
```

**Primitives handle behavior and accessibility.** They manage focus management, keyboard interaction, ARIA roles, and layout — the hard, invisible work that makes a UI actually accessible.

**Primitives do NOT add `data-ai-*` attributes.** That is the responsibility of the component layer. This separation means primitives are reusable for any purpose, while components carry the full AI contract.

---

## Installation

```bash
npm install @domglyph/primitives
```

Peer dependencies:

```bash
npm install react@^18 react-dom@^18
```

---

## Primitives

### Box

A polymorphic container element. Renders as any HTML element via the `as` prop, defaulting to `div`. The base building block for layout.

```tsx
import { Box } from '@domglyph/primitives';

<Box as="section" style={{ padding: '24px' }}>
  Page content here
</Box>

<Box as="article" style={{ maxWidth: '640px', margin: '0 auto' }}>
  Article content
</Box>

<Box as="header">
  Site header
</Box>
```

`Box` forwards all standard HTML attributes and refs. It has no opinion about styling.

---

### Stack

A flexbox layout primitive for stacking children vertically or horizontally with consistent spacing.

```tsx
import { Stack } from '@domglyph/primitives';

// Vertical stack with gap
<Stack direction="column" gap="16px">
  <FormField id="name" fieldType="text" label="Full name" />
  <FormField id="email" fieldType="email" label="Email" />
  <ActionButton action="submit-form" state="idle" label="Submit" />
</Stack>

// Horizontal stack
<Stack direction="row" gap="8px" align="center">
  <StatusIcon />
  <Text size="sm">3 items selected</Text>
</Stack>
```

---

### Text

A semantic typography primitive. Renders as any text-level HTML element via the `as` prop. Use it for labels, headings, captions, and body copy.

```tsx
import { Text } from '@domglyph/primitives';

// Form label
<Text as="label" size="sm" weight="medium">
  Full name
</Text>

// Heading
<Text as="h2" size="xl" weight="bold">
  Account settings
</Text>

// Caption
<Text as="span" size="xs" color="muted">
  Last updated 2 minutes ago
</Text>
```

---

### ButtonBase

An accessible button primitive with no visual styling. Handles keyboard events (`Enter`, `Space`), ARIA attributes, and disabled state management. The foundation of `ActionButton`.

When building custom components on `ButtonBase`, you are responsible for adding `data-ai-*` attributes:

```tsx
import { ButtonBase } from '@domglyph/primitives';

<ButtonBase
  onClick={handleClick}
  disabled={isDisabled}
  aria-label="Close dialog"
  data-ai-role="action"
  data-ai-id="close-dialog"
  data-ai-action="close-dialog"
  data-ai-state="idle"
>
  <CloseIcon />
</ButtonBase>
```

`ButtonBase` always renders as a native `<button>` element. It does not use `role="button"` on a `<div>`. This ensures correct keyboard behaviour, screen reader support, and form interaction without extra work.

---

### InputBase

An accessible input primitive with no visual styling. Handles value state, change events, and ARIA attributes for error and required states. The foundation of `FormField`.

```tsx
import { InputBase } from '@domglyph/primitives';

<InputBase
  type="email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  aria-label="Email address"
  aria-required="true"
  aria-invalid={hasError}
  data-ai-role="field"
  data-ai-id="user-email"
  data-ai-field-type="email"
  data-ai-required="true"
  data-ai-state={hasError ? 'error' : 'idle'}
/>
```

---

### DialogBase

An accessible dialog primitive with focus trapping, scroll locking, and `Escape` key dismissal. Renders as a native `<dialog>` element. The foundation of `ConfirmDialog`.

```tsx
import { DialogBase } from '@domglyph/primitives';

<DialogBase
  open={isOpen}
  onClose={handleClose}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  data-ai-role="modal"
  data-ai-id="confirm-delete"
  data-ai-state={isOpen ? 'expanded' : 'idle'}
>
  <h2 id="dialog-title">Confirm deletion</h2>
  <p id="dialog-description">This cannot be undone.</p>
  <ButtonBase onClick={handleClose}>Cancel</ButtonBase>
  <ButtonBase onClick={handleConfirm}>Confirm</ButtonBase>
</DialogBase>
```

`DialogBase` traps focus within the dialog while it is open and restores focus to the trigger element when it closes.

---

## When to use primitives directly

Use `@domglyph/primitives` directly when:

- You are building a **custom component** that needs DOMglyph's accessibility guarantees but has unique visual requirements not served by the components package
- You need a **polymorphic container** (`Box`) or **layout primitive** (`Stack`) without pulling in a full component

When you build on primitives directly, **you are responsible for adding `data-ai-*` attributes** to make the component inspectable by the AI runtime. See [`@domglyph/ai-contract`](../ai-contract/README.md) for the full attribute specification and [`@domglyph/testing`](../testing/README.md) for validation utilities to use in your tests.

---

## Part of DOMglyph

`@domglyph/primitives` is part of the [DOMglyph](../../README.md) design system.

- [Main repository](../../README.md)
- [Documentation](http://localhost:3001/docs/primitives)
- [Contributing](../../CONTRIBUTING.md)

---

## ☕ Support

If you find DOMglyph useful, you can support the project:

👉 https://buymeacoffee.com/nishchya

It helps keep the project alive and growing.
