# Contributing to DOMglyph

Thank you for your interest in contributing to DOMglyph. Whether you are fixing a bug, improving documentation, adding a new component, or improving tooling — contributions of all kinds are welcome and appreciated.

This guide covers everything you need to get started.

---

## Code of Conduct

We are committed to making DOMglyph a welcoming project for everyone. Please follow these principles in all interactions:

- Be respectful and constructive in code reviews, issues, and discussions
- Assume good intent; ask for clarification before assuming malice
- Provide actionable feedback, not personal criticism
- No harassment, discrimination, or exclusionary behaviour of any kind

If you experience or witness unacceptable behaviour, please open a private GitHub issue or contact the maintainers directly.

---

## What Contributions Are Welcome

- Bug fixes (with a test that would have caught the bug)
- New components that follow the AI contract compliance checklist
- Improvements to existing component APIs
- Documentation fixes and improvements
- New test utilities in `@domglyph/testing`
- Design token additions or adjustments
- Build tooling improvements

If you are unsure whether a contribution is in scope, open a GitHub Discussion before investing significant time.

---

## Project Structure

```
cortexui/
  apps/
    docs/           # Next.js 14 documentation site (port 3001)
    playground/     # Development playground for manual testing
  packages/
    ai-contract/    # @domglyph/ai-contract — data-ai-* spec, types, validators
    components/     # @domglyph/components  — React components
    primitives/     # @domglyph/primitives  — Base accessible primitives
    runtime/        # @domglyph/runtime     — window.__CORTEX_UI__ browser API
    testing/        # @domglyph/testing     — Contract validation + vitest matchers
    tokens/         # @domglyph/tokens      — Design tokens
  tooling/
    eslint/         # Shared ESLint config
    tsconfig/       # Shared TypeScript configs
    prettier/       # Shared Prettier config
```

Each package under `packages/` is independently versioned and published to npm under the `@domglyph` scope. The monorepo is managed with pnpm workspaces and built with Turbo.

---

## Development Setup

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9

### Clone and install

```bash
git clone https://github.com/cortexui/cortexui.git
cd cortexui
pnpm install
```

### Build all packages

```bash
pnpm build
```

### Start dev mode (docs + playground)

```bash
pnpm dev
```

### Start docs only (port 3001)

```bash
pnpm --filter @domglyph/docs dev
```

### Run all tests

```bash
pnpm test
```

### Run type checking across all packages

```bash
pnpm typecheck
```

### Run linting across all packages

```bash
pnpm lint
```

---

## Making Changes

### For packages (`packages/`)

Source files live in `src/`. The package is built with `tsup`.

```bash
# Watch-build a specific package during development
pnpm --filter @domglyph/components dev

# Run tests for a specific package
pnpm --filter @domglyph/components test

# Type check a specific package
pnpm --filter @domglyph/components typecheck
```

Write tests alongside your changes. Tests for a package live in `packages/<name>/tests/` or co-located with source files. Use vitest.

### For the docs site (`apps/docs/`)

- MDX documentation pages live in `apps/docs/app/docs/**/page.mdx`
- Custom React components for the docs site live in `apps/docs/components/`
- The sidebar navigation is configured in `apps/docs/lib/navigation.ts`

To preview docs changes:

```bash
pnpm --filter @domglyph/docs dev
# Open http://localhost:3001
```

---

## Pull Request Process

1. Fork the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes and write tests.

3. Run the full test suite:
   ```bash
   pnpm test
   ```

4. Run type checking:
   ```bash
   pnpm typecheck
   ```

5. Run linting:
   ```bash
   pnpm lint
   ```

6. Create a changeset for any package changes (see [Changesets](#changesets)):
   ```bash
   pnpm changeset
   ```

7. Push your branch and open a Pull Request against `main`.

8. Fill in the PR template completely. Link any related issues.

PRs without passing tests, type errors, or missing changesets (for package changes) will not be merged.

---

## Commit Convention

DOMglyph follows [Conventional Commits](https://www.conventionalcommits.org/).

| Prefix | Use for |
|---|---|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation changes only |
| `refactor:` | Code change with no behaviour change |
| `test:` | Adding or updating tests only |
| `chore:` | Build tooling, dependencies, config |

Use a scope in parentheses to indicate which package is affected:

```
feat(components): add Tooltip component with AI contract
fix(runtime): correctly handle missing data-ai-screen attribute
docs: update ActionButton usage examples
chore(tokens): add spacing scale
test(testing): add matcher for toHaveAIAttributes
```

Keep the subject line under 72 characters. Add a body if the change requires explanation.

---

## Changesets

DOMglyph uses [Changesets](https://github.com/changesets/changesets) to manage package versioning and changelogs.

Every pull request that changes a package must include a changeset.

```bash
# Describe what changed and at what semver level (patch/minor/major)
pnpm changeset

# Preview what the next versions would be
pnpm changeset status
```

CI handles version bumping and publishing:

```bash
# These run in CI — do not run locally unless you are a maintainer
pnpm changeset version   # bumps versions and updates changelogs
pnpm changeset publish   # publishes changed packages to npm
```

If your PR only changes docs or tooling with no effect on published packages, you may skip the changeset.

---

## AI Contract Compliance

This is the most important contribution requirement. Every component in DOMglyph — new or modified — must correctly implement the AI contract.

### Required attributes

Any new component MUST include:

| Attribute | Requirement |
|---|---|
| `data-ai-role` | On the root element of every component |
| `data-ai-id` | On every actionable element (buttons, links, form triggers) |
| `data-ai-state` | On every stateful element |
| `data-ai-action` | On elements where `data-ai-role="action"` |
| `data-ai-field-type` | On elements where `data-ai-role="field"` |

### Validation

Every component must pass `validateAIContractNode()` from `@domglyph/testing`. A test must verify this explicitly:

```ts
import { validateAIContractNode } from '@domglyph/testing';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { MyComponent } from '../src/MyComponent';

describe('MyComponent AI contract', () => {
  test('has a valid AI contract', () => {
    render(<MyComponent action="my-action" state="idle" />);
    const el = screen.getByRole('button');
    const result = validateAIContractNode(el);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('reflects state changes in data-ai-state', () => {
    const { rerender } = render(<MyComponent action="my-action" state="idle" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-ai-state', 'idle');

    rerender(<MyComponent action="my-action" state="loading" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-ai-state', 'loading');
  });
});
```

PRs that modify or add components without these tests will not be merged.

---

## Adding a New Component

Follow this checklist when adding a component to `@domglyph/components`:

- [ ] Create `packages/components/src/MyComponent.tsx`
- [ ] Export from `packages/components/src/index.ts`
- [ ] Add `data-ai-role` on the root element
- [ ] Add `data-ai-id` on all actionable child elements
- [ ] Add `data-ai-state` on all stateful elements
- [ ] Add `data-ai-action` if the component is an action trigger
- [ ] Write unit tests in `packages/components/tests/MyComponent.test.tsx`
- [ ] Include an explicit AI contract validation test
- [ ] Include state transition tests
- [ ] Include an accessibility test using `runAccessibilityChecks`
- [ ] Add a documentation page at `apps/docs/app/docs/components/my-component/page.mdx`
- [ ] Add the component to the sidebar in `apps/docs/lib/navigation.ts`
- [ ] Create a changeset with `pnpm changeset`

New components must be built on primitives from `@domglyph/primitives` or on standard HTML elements. Do not introduce new dependencies to the components package without prior discussion.

---

## Code Style

DOMglyph enforces the following conventions. The ESLint and Prettier configs in `tooling/` handle most of this automatically.

- **TypeScript strict mode** is on for all packages
- **Named exports only** — no default exports
- **`readonly` on all props interfaces** — components should not mutate props
- **Functional components** with `React.forwardRef` for any component that forwards a DOM ref
- **No inline styles** except for dynamic values that cannot be expressed as tokens
- **No `any`** — use `unknown` and narrow where needed

```ts
// Correct
export interface ActionButtonProps {
  readonly action: string;
  readonly state: AIState;
  readonly label: string;
  readonly onClick?: () => void;
}

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ action, state, label, onClick }, ref) => {
    // ...
  }
);
ActionButton.displayName = 'ActionButton';
```

---

## Testing Standards

- Tests live in `packages/<name>/tests/` or co-located as `*.test.ts` / `*.test.tsx`
- Use **vitest** as the test runner
- Use **@testing-library/react** for component tests
- Every component test must include:
  - An AI contract validation test (`validateAIContractNode`)
  - State transition tests for every `AIState` the component accepts
  - An accessibility test using `runAccessibilityChecks` from `@domglyph/testing`
- Target 100% coverage of `data-ai-*` attribute paths

---

## Reporting Bugs

Please use GitHub Issues. A good bug report includes:

- The package name and version (e.g., `@domglyph/components@1.1.0`)
- A minimal reproduction — a single file or a StackBlitz link
- What you expected to happen
- What actually happened
- Your browser or Node.js version

Do not open issues for questions. Use GitHub Discussions instead.

---

## Questions

Open a [GitHub Discussion](https://github.com/cortexui/cortexui/discussions) for any question that is not a bug report or a concrete feature request. This keeps issues focused and searchable.

---

Thank you for contributing to DOMglyph.
