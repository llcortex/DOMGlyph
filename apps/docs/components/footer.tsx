export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 px-6 py-5 text-sm text-slate-500 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <a
          href="https://buymeacoffee.com/nishchya"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-900/20 dark:hover:text-brand-400"
        >
          <span aria-hidden="true">☕</span>
          <span>Support DOMglyph</span>
          <span aria-hidden="true">→</span>
          <span>Buy me a coffee</span>
        </a>
      </div>
    </footer>
  );
}
