import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "DOMglyph Playground",
  description: "Interactive demos for AI-aware DOMglyph components."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
