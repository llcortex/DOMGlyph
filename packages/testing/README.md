# @domglyph/testing  (formerly [@cortexui/testing](https://www.npmjs.com/package/@cortexui/testing))

[![npm version](https://img.shields.io/npm/v/@domglyph/testing?color=0ea5e9)](https://www.npmjs.com/package/@domglyph/testing)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

AI contract validation and testing utilities for DOMglyph.

---

## Overview

`@domglyph/testing` gives you everything you need to verify that components correctly implement the DOMglyph AI contract. It includes:

- **`validateAIContractNode`** — validates `data-ai-*` attributes on a DOM element
- **`runComponentComplianceChecks`** — full compliance check combining AI contract and accessibility
- **Vitest matchers** — `toBeAIContractValid`, `toHaveAIAttributes`, `toPassAccessibilityChecks`
- **Test fixtures** — pre-built DOM elements for unit testing contract validators
- **`runAccessibilityChecks`** — accessibility audit for individual elements

---

## Installation

```bash
npm install --save-dev @domglyph/testing
```

---

## API Reference

### validateAIContractNode(element)

Validates all `data-ai-*` attributes on a DOM element against the DOMglyph AI contract specification. Returns a result object — does not throw.

```ts
import { validateAIContractNode } from '@domglyph/testing';

const result = validateAIContractNode(element);
// {
//   valid: boolean,
//   errors: string[],
//   attributes: AIAttributeMap
// }
```

Example:

```ts
import { validateAIContractNode } from '@domglyph/testing';
import { render, screen } from '@testing-library/react';
import { ActionButton } from '@domglyph/components';

render(<ActionButton action="save-profile" state="idle" label="Save" />);
const btn = screen.getByRole('button');

const result = validateAIContractNode(btn);
// { valid: true, errors: [], attributes: { role: 'action', id: 'save-profile', state: 'idle', ... } }
```

When there are violations:

```ts
// A button with data-ai-role="action" but no data-ai-id or data-ai-action
const result = validateAIContractNode(badElement);
// {
//   valid: false,
//   errors: [
//     'Elements with data-ai-role="action" must have data-ai-id',
//     'Elements with data-ai-role="action" must have data-ai-action'
//   ],
//   attributes: { role: 'action', id: null, action: null, state: null, ... }
// }
```

---

### runComponentComplianceChecks(element, options)

Runs a full compliance check that covers both the AI contract and accessibility requirements. Useful for a single comprehensive assertion in integration tests.

```ts
import { runComponentComplianceChecks } from '@domglyph/testing';

const result = runComponentComplianceChecks(element, {
  requiredAttributes: ['data-ai-id', 'data-ai-role', 'data-ai-state'],
  requiredAriaAttributes: ['aria-label'],
});
// {
//   valid: boolean,
//   contractErrors: string[],
//   accessibilityErrors: string[]
// }
```

---

### Vitest Matchers

Register custom matchers to write expressive assertions:

```ts
import { registerCortexMatchers } from '@domglyph/testing';
import { expect } from 'vitest';

// Call once in your vitest setup file (vitest.setup.ts)
registerCortexMatchers(expect);
```

Once registered, the following matchers are available on any DOM element:

#### `toBeAIContractValid()`

Asserts that the element passes full AI contract validation.

```ts
expect(element).toBeAIContractValid();
// Fails with: "Expected element to have a valid AI contract, but found 2 error(s): ..."
```

#### `toHaveAIAttributes(attributes)`

Asserts that the element has specific `data-ai-*` attribute values.

```ts
expect(element).toHaveAIAttributes({
  'data-ai-role': 'action',
  'data-ai-action': 'save-profile',
  'data-ai-state': 'idle',
});
```

#### `toPassAccessibilityChecks()`

Asserts that the element passes the DOMglyph accessibility audit.

```ts
expect(element).toPassAccessibilityChecks();
```

---

### Test Fixtures

Fixtures create valid DOM elements with AI contract attributes. Use them for testing validators, matchers, and utilities without needing to render full components.

```ts
import { createActionFixture, createStatusFixture, createFieldFixture, createFormFixture } from '@domglyph/testing';

// Creates a <button> with data-ai-role="action" and the given props
const btn = createActionFixture({ action: 'save-profile', state: 'idle' });

// Creates a <div> with data-ai-role="status" and the given type
const banner = createStatusFixture({ type: 'success', message: 'Saved!' });

// Creates an <input> with data-ai-role="field"
const input = createFieldFixture({ id: 'user-email', fieldType: 'email', required: true });

// Creates a <form> element with data-ai-role="form"
const form = createFormFixture({ id: 'contact-form' });
```

---

### runAccessibilityChecks(element)

Runs a focused accessibility audit on a single element and returns any violations:

```ts
import { runAccessibilityChecks } from '@domglyph/testing';

const result = runAccessibilityChecks(element);
// {
//   passed: boolean,
//   violations: Array<{
//     rule: string,
//     message: string,
//     impact: 'critical' | 'serious' | 'moderate' | 'minor'
//   }>
// }
```

---

## Example Test Suite

A complete test file for a custom component, covering AI contract compliance, state transitions, and accessibility:

```ts
import { describe, test, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { validateAIContractNode, runAccessibilityChecks, registerCortexMatchers } from '@domglyph/testing';
import { MyButton } from '../src/MyButton';

beforeAll(() => {
  registerCortexMatchers(expect);
});

describe('MyButton', () => {
  describe('AI contract', () => {
    test('has a valid AI contract in idle state', () => {
      render(<MyButton action="confirm-order" state="idle" label="Confirm order" />);
      const btn = screen.getByRole('button');
      const result = validateAIContractNode(btn);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('has the correct data-ai-* attributes', () => {
      render(<MyButton action="confirm-order" state="idle" label="Confirm order" />);
      const btn = screen.getByRole('button');
      expect(btn).toHaveAIAttributes({
        'data-ai-role': 'action',
        'data-ai-id': 'confirm-order',
        'data-ai-action': 'confirm-order',
        'data-ai-state': 'idle',
      });
    });

    test('passes full contract validation', () => {
      render(<MyButton action="confirm-order" state="idle" label="Confirm order" />);
      expect(screen.getByRole('button')).toBeAIContractValid();
    });
  });

  describe('state transitions', () => {
    test('reflects loading state in data-ai-state', () => {
      const { rerender } = render(
        <MyButton action="confirm-order" state="idle" label="Confirm order" />
      );
      expect(screen.getByRole('button')).toHaveAttribute('data-ai-state', 'idle');

      rerender(<MyButton action="confirm-order" state="loading" label="Confirm order" />);
      expect(screen.getByRole('button')).toHaveAttribute('data-ai-state', 'loading');
    });

    test('reflects error state in data-ai-state', () => {
      const { rerender } = render(
        <MyButton action="confirm-order" state="idle" label="Confirm order" />
      );
      rerender(<MyButton action="confirm-order" state="error" label="Confirm order" />);
      expect(screen.getByRole('button')).toHaveAttribute('data-ai-state', 'error');
    });

    test('is disabled in loading state', () => {
      render(<MyButton action="confirm-order" state="loading" label="Confirm order" />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    test('passes accessibility checks', () => {
      render(<MyButton action="confirm-order" state="idle" label="Confirm order" />);
      expect(screen.getByRole('button')).toPassAccessibilityChecks();
    });

    test('has accessible name from label', () => {
      render(<MyButton action="confirm-order" state="idle" label="Confirm order" />);
      expect(screen.getByRole('button', { name: 'Confirm order' })).toBeInTheDocument();
    });
  });
});
```

---

## Part of DOMglyph

`@domglyph/testing` is part of the [DOMglyph](../../README.md) design system.

- [Main repository](../../README.md)
- [Documentation](http://localhost:3001/docs/testing)
- [Contributing](../../CONTRIBUTING.md)

---

## ☕ Support

If you find DOMglyph useful, you can support the project:

👉 https://buymeacoffee.com/nishchya

It helps keep the project alive and growing.
