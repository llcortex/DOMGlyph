"use client";

import {
  AIEvent,
  AIRole,
  AIState,
  createAIAttributes
} from "@domglyph/ai-contract";

const exampleRows = [
  {
    id: "docs-row-search",
    item: "Search docs",
    state: "Ready"
  },
  {
    id: "docs-row-inspect",
    item: "Inspect metadata",
    state: "Visible in AI View"
  }
] as const;

export function DocsCortexSurface(): JSX.Element {
  return (
    <section
      {...createAIAttributes({
        id: "docs-surface-screen",
        role: AIRole.SCREEN,
        screen: "docs",
        section: "live-cortex-surface"
      })}
      className="mb-10 rounded-[28px] border border-brand-500/20 bg-gradient-to-b from-brand-500/[0.08] to-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)] dark:to-slate-950"
    >
      <div className="mb-6">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-400">
          Live DOMglyph Surface
        </p>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          This block renders live DOMglyph contract metadata in the docs DOM so AI View can inspect
          real machine-readable elements instead of only code examples.
        </p>
      </div>

      <div
        {...createAIAttributes({
          id: "docs-surface-status",
          role: AIRole.STATUS,
          event: AIEvent.ACTION_COMPLETED,
          result: "ready"
        })}
        className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-950 dark:text-emerald-100"
      >
        AI View can now inspect a live status region, form fields, actions, and table entities on
        every docs page.
      </div>

      <form
        {...createAIAttributes({
          id: "docs-surface-form",
          role: AIRole.FORM,
          section: "docs-search"
        })}
        className="mb-6 rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-800 dark:bg-slate-950/70"
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-100">
            <span className="mb-2 block">Query</span>
            <input
              {...createAIAttributes({
                id: "docs-surface-query",
                role: AIRole.FIELD,
                fieldType: "search",
                required: true,
                state: AIState.IDLE
              })}
              aria-label="Query"
              defaultValue="Find runtime docs"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              required
              type="search"
            />
          </label>

          <button
            {...createAIAttributes({
              id: "docs-open-search",
              role: AIRole.ACTION,
              action: "open-search",
              state: AIState.IDLE
            })}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-medium text-white transition hover:bg-brand-700"
            type="button"
          >
            Search Docs
          </button>

          <button
            {...createAIAttributes({
              id: "docs-toggle-ai-view",
              role: AIRole.ACTION,
              action: "toggle-ai-view",
              state: AIState.IDLE
            })}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
            type="button"
          >
            Inspect Metadata
          </button>
        </div>
      </form>

      <div
        {...createAIAttributes({
          id: "docs-surface-table",
          role: AIRole.TABLE,
          entity: "docs-item"
        })}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70"
      >
        <table className="w-full border-collapse text-left text-sm">
          <caption className="border-b border-slate-200 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            AI-addressable docs entities
          </caption>
          <thead className="bg-slate-50 dark:bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Item</th>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">State</th>
            </tr>
          </thead>
          <tbody>
            {exampleRows.map((row) => (
              <tr
                key={row.id}
                {...createAIAttributes({
                  id: row.id,
                  role: AIRole.SECTION,
                  entity: "docs-item",
                  entityId: row.id
                })}
                className="border-t border-slate-200 dark:border-slate-800"
              >
                <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{row.item}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
