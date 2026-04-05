import Link from "next/link";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/ai-contract", label: "AI Contract" },
  { href: "/components", label: "Components" },
  { href: "/examples", label: "Examples" },
  { href: "/runtime", label: "Runtime API" }
];

export function DocsShell({
  children,
  title,
  eyebrow,
  summary
}: Readonly<{
  children: React.ReactNode;
  title: string;
  eyebrow: string;
  summary: string;
}>): JSX.Element {
  return (
    <main style={{ padding: "32px" }}>
      <div
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          margin: "0 auto",
          maxWidth: "1280px"
        }}
      >
        <aside
          style={{
            alignSelf: "start",
            background: "var(--docs-surface)",
            backdropFilter: "blur(14px)",
            border: "1px solid var(--docs-line)",
            borderRadius: "var(--docs-radius)",
            boxShadow: "var(--docs-shadow)",
            padding: "24px",
            position: "sticky",
            top: "24px"
          }}
        >
          <Link href="/" style={{ display: "block", marginBottom: "24px" }}>
            <div style={{ fontSize: "0.8rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              DOMglyph
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "8px" }}>
              AI-native interfaces
            </div>
          </Link>
          <nav style={{ display: "grid", gap: "10px" }}>
            {navigation.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                style={{
                  border: "1px solid var(--docs-line)",
                  borderRadius: "999px",
                  padding: "10px 14px"
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section
          style={{
            background: "var(--docs-surface)",
            backdropFilter: "blur(14px)",
            border: "1px solid var(--docs-line)",
            borderRadius: "var(--docs-radius)",
            boxShadow: "var(--docs-shadow)",
            overflow: "hidden"
          }}
        >
          <header
            style={{
              borderBottom: "1px solid var(--docs-line)",
              padding: "40px 40px 32px"
            }}
          >
            <p
              style={{
                color: "var(--docs-accent)",
                fontSize: "0.82rem",
                letterSpacing: "0.18em",
                margin: 0,
                textTransform: "uppercase"
              }}
            >
              {eyebrow}
            </p>
            <h1 style={{ fontSize: "3rem", lineHeight: 1.05, margin: "14px 0 10px" }}>{title}</h1>
            <p style={{ color: "var(--docs-muted)", fontSize: "1.1rem", margin: 0, maxWidth: "70ch" }}>
              {summary}
            </p>
          </header>
          <div style={{ display: "grid", gap: "28px", padding: "36px 40px 48px" }}>{children}</div>
        </section>
      </div>
    </main>
  );
}
