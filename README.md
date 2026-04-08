# llcortex.ai

Tools for AI and Humans. Built in India — for the rest of the world.

---

## What is this?

I'm Nishchay. llcortex is my alter ego, lab and long-term bet on where software infrastructure is heading.

I'm a fullstack engineer. I got tired of AI tooling that's either a wrapper around an API or a prompt trick dressed up as a product. The interesting problem — the one nobody's really solved — is making AI systems that are *auditable*. Where you can trace what happened, why, and whether to trust it. And making life easier for AI.

That's the thread running through everything I build here.

---

## Projects

### [DOMglyph](https://domglyph.llcortex.ai) — AI-native design system

Most design systems answer one question: what does this look like for a human? DOMglyph answers a second one: what does this mean, and how can a machine act on it reliably?

Every component ships with two layers. A visual layer for your users. A semantic layer for AI agents — expressed as `data-ai-*` HTML attributes that stay stable across refactors, style changes, and DOM restructuring.

```html
<button
  data-ai-id="save-profile"
  data-ai-role="action"
  data-ai-action="save-profile"
  data-ai-state="idle"
>
  Save Profile
</button>
```

There's also a runtime inspection API — `window.__DOMGLYPH__` — that lets agents query the interface without guessing:

```js
const actions = window.__DOMGLYPH__.getAvailableActions();
// [{ id: "submit-order", state: "idle", screen: "checkout" }, ...]

window.__DOMGLYPH__.trigger("submit-order");
```

The goal: AI-UI interaction that's as reliable as calling an API endpoint. No DOM scraping, no CSS selector brittleness, no guessing from button text.

Works with React and Vanilla JS. Includes components (ActionButton, FormField, DataTable, Modal, and more), primitives, pattern guides, and devtools for inspecting AI metadata.

→ [Docs](https://domglyph.llcortex.ai/docs/introduction/what-is-cortexui) · [Demo](https://domglyph-demo.llcortex.ai) · [GitHub](https://github.com/llcortex/DOMGlyph)

---

### [CortexLog](https://cortexlog.llcortex.ai) — Durable project memory for humans + AI agents

Most systems log events. CortexLog builds timelines of *understanding* — structured memory that both humans and AI agents can navigate, reference, and trust.

Think `git log`, but for reasoning. Not just "what changed" but "what was decided, why, and what context led there."

→ [cortexlog.llcortex.ai](https://cortexlog.llcortex.ai)

---

### Manasvi - Agent Runtime *(upcoming)*

A policy-first runtime for AI agents. Models propose actions. Policies decide whether they execute. Humans stay in the loop.

No "just trust the model" shortcuts. It us not your popular red crab.

---

## What I'm not building

- API wrappers
- Prompt engineering tricks
- Tools that solve one thing and die in six months

Foundations. That's the slower, harder, compounding bet.

---

## About me

Fullstack developer from India. I work end-to-end — design, backend, infrastructure. Most interested in AI-native architectures: what does software look like when AI agents are real clients of your system, not just a feature bolted on top?

llcortex is where I think out loud, ship rough things, and iterate in public.

---

## Get involved

This is early. If something here resonates:

- Open an issue
- Suggest something worth building
- Build on top and tell me about it

---

## Support

- ⭐ Star the repo
- Share it with someone who'd care
- Or: [buymeacoffee.com/nishchya](https://buymeacoffee.com/nishchya)

---

> The future isn't AI-powered. It's memory-powered AI.
>
> Welcome to llcortex.
