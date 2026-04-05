import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AIViewOverlay } from "@/components/ai-view-overlay";
import { AIViewProvider } from "@/components/ai-view-toggle";
import { DocsRuntimeBridge } from "@/components/docs-runtime-bridge";
import { Search } from "@/components/search";
import "@/app/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cortexui.llcortex.ai";
const socialImageAlt = "DOMglyph social preview showing UI that speaks to humans and machines.";
const socialImageUrl = `${siteUrl}/social-preview.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s — DOMglyph",
    default: "DOMglyph — AI-native design system"
  },
  description: "The design system that makes web interfaces visually usable for humans and programmatically operable for AI agents.",
  keywords: ["design system", "AI", "UI components", "accessibility", "React"],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "DOMglyph",
    title: "DOMglyph — AI-native design system",
    description:
      "UI that speaks to humans and machines. DOMglyph makes interfaces visually usable for people and programmatically operable for AI agents.",
    images: [
      {
        url: socialImageUrl,
        width: 1290,
        height: 970,
        alt: socialImageAlt
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DOMglyph — AI-native design system",
    description:
      "UI that speaks to humans and machines. DOMglyph makes interfaces visually usable for people and programmatically operable for AI agents.",
    images: [
      {
        url: socialImageUrl,
        alt: socialImageAlt
      }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AIViewProvider>
            <DocsRuntimeBridge />
            {children}
            <AIViewOverlay />
            <Search />
          </AIViewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
