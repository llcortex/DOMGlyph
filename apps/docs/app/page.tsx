import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            AI-native design system
          </div>
          <h1 className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            UI that speaks to<br />
            <span className="text-brand-600">humans and machines</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            DOMglyph is a design system built for the AI era. Every component exposes a machine-readable contract — making your UI deterministically operable by AI agents.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/docs/introduction/what-is-cortexui" className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">
              Read the docs
            </Link>
            <Link href="/docs/ai-contract/overview" className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              See AI Contract →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⬡",
                title: "Dual-layer architecture",
                desc: "Every component has a visual layer for humans and a semantic layer for AI. Both are first-class."
              },
              {
                icon: "◈",
                title: "Deterministic interactions",
                desc: "AI agents don't guess. The runtime exposes exact state, actions, and outcomes — no DOM scraping."
              },
              {
                icon: "◉",
                title: "Runtime inspection API",
                desc: "window.__DOMGLYPH__ gives agents structured access to screen context, forms, and events."
              }
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="text-2xl mb-4 text-brand-600">{f.icon}</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50 border-t border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Every element is a contract</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Traditional UI is built for eyes. DOMglyph is built for eyes and agents. Every interactive element declares its identity, intent, and state — in a format both humans and AI can trust.
            </p>
            <Link href="/docs/ai-contract/attributes" className="text-brand-600 dark:text-brand-400 font-medium hover:underline text-sm">
              Explore data-ai-* attributes →
            </Link>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0d1117] p-6 font-mono text-sm">
            <div className="text-slate-500 mb-3 text-xs">// AI-native button</div>
            <div className="space-y-1">
              <div><span className="text-blue-400">&lt;button</span></div>
              <div className="pl-4"><span className="text-green-400">data-ai-id</span><span className="text-slate-400">=</span><span className="text-amber-300">&quot;save-profile&quot;</span></div>
              <div className="pl-4"><span className="text-green-400">data-ai-role</span><span className="text-slate-400">=</span><span className="text-amber-300">&quot;action&quot;</span></div>
              <div className="pl-4"><span className="text-green-400">data-ai-action</span><span className="text-slate-400">=</span><span className="text-amber-300">&quot;save-profile&quot;</span></div>
              <div className="pl-4"><span className="text-green-400">data-ai-state</span><span className="text-slate-400">=</span><span className="text-amber-300">&quot;idle&quot;</span></div>
              <div><span className="text-blue-400">&gt;</span></div>
              <div className="pl-4 text-slate-300">Save Profile</div>
              <div><span className="text-blue-400">&lt;/button&gt;</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500 text-xs space-y-1">
              <div><span className="text-slate-400">id</span> → stable identifier for targeting</div>
              <div><span className="text-slate-400">role</span> → semantic type: action | field | form | table</div>
              <div><span className="text-slate-400">action</span> → executable intent</div>
              <div><span className="text-slate-400">state</span> → current condition: idle | loading | success | error</div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto quote */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl font-light text-slate-700 dark:text-slate-300 leading-relaxed">
            &ldquo;The web was built for humans. The next generation of software is being operated by AI. DOMglyph is the bridge — a design system where every pixel has a machine-readable meaning.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/docs/philosophy/evolution" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">Read the philosophy →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
