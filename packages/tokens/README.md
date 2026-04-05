# @domglyph/tokens (formerly [@cortexui/tokens](https://www.npmjs.com/package/@cortexui/tokens))

[![npm version](https://img.shields.io/npm/v/@domglyph/tokens?color=0ea5e9)](https://www.npmjs.com/package/@domglyph/tokens)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../../LICENSE)

Design tokens for DOMglyph — colors, spacing, typography, and more.

---

## Overview

`@domglyph/tokens` is the single source of truth for DOMglyph's visual design. All components and primitives consume these tokens. By centralising design values here, visual changes propagate automatically across the entire system.

The package exports tokens as typed JavaScript objects, which means they are usable in TypeScript without a build step and tree-shakeable in modern bundlers.

---

## Installation

```bash
npm install @domglyph/tokens
```

---

## Usage

### Color tokens

```ts
import { colorTokens } from '@domglyph/tokens';

// colorTokens.name === "color"
// colorTokens.values is a record of color names to hex values

console.log(colorTokens.values.surface);  // "#ffffff"
console.log(colorTokens.values.accent);   // "#111827"
```

Use color tokens in component styles to stay consistent with the design system:

```ts
import { colorTokens } from '@domglyph/tokens';

const styles = {
  background: colorTokens.values.surface,
  color: colorTokens.values.accent,
};
```

### TypeScript type

All token scales share the `DesignTokenScale` type:

```ts
import type { DesignTokenScale } from '@domglyph/tokens';

// DesignTokenScale = {
//   readonly name: string;
//   readonly values: Readonly<Record<string, string>>;
// }
```

This type is consistent across all token categories, so utilities can accept any token scale generically:

```ts
import type { DesignTokenScale } from '@domglyph/tokens';

function listTokenValues(scale: DesignTokenScale): string[] {
  return Object.entries(scale.values).map(([name, value]) => `${name}: ${value}`);
}
```

---

## Available Tokens

| Export | Token Scale | Description |
|---|---|---|
| `colorTokens` | `"color"` | Surface and accent colors |
| `DesignTokenScale` | — | TypeScript type for all token scales |

---

## CSS Custom Properties

If you are using `@domglyph/primitives`, the `primitiveTheme` object exposes tokens as CSS custom property definitions, letting you inject them into your app's `:root` with a single call:

```ts
import { primitiveTheme } from '@domglyph/primitives';

// primitiveTheme contains CSS custom property maps derived from @domglyph/tokens
// Inject via your preferred CSS-in-JS solution or a <style> tag
```

This approach lets you consume tokens in plain CSS or any styling system that supports CSS custom properties.

---

## Part of DOMglyph

`@domglyph/tokens` is part of the [DOMglyph](../../README.md) design system.

- [Main repository](../../README.md)
- [Documentation](http://localhost:3001/docs/tokens)
- [Contributing](../../CONTRIBUTING.md)

---

## ☕ Support

If you find DOMglyph useful, you can support the project:

👉 https://buymeacoffee.com/nishchya

It helps keep the project alive and growing.
