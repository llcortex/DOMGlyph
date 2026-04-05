import type { CSSProperties } from "react";

import { colorTokens } from "@domglyph/tokens";

export const primitiveVars = {
  borderColor: "--domglyph-border-color",
  dangerColor: "--domglyph-danger-color",
  focusRing: "--domglyph-focus-ring",
  foreground: "--domglyph-foreground",
  mutedForeground: "--domglyph-muted-foreground",
  radius: "--domglyph-radius",
  spacing: "--domglyph-spacing",
  successColor: "--domglyph-success-color",
  surface: "--domglyph-surface"
} as const;

export const primitiveTheme = {
  [primitiveVars.surface]: colorTokens.values.surface,
  [primitiveVars.foreground]: colorTokens.values.accent,
  [primitiveVars.borderColor]: "rgba(17, 24, 39, 0.16)",
  [primitiveVars.focusRing]: "rgba(17, 24, 39, 0.24)",
  [primitiveVars.mutedForeground]: "rgba(17, 24, 39, 0.7)",
  [primitiveVars.dangerColor]: "#b91c1c",
  [primitiveVars.successColor]: "#15803d",
  [primitiveVars.radius]: "12px",
  [primitiveVars.spacing]: "0.75rem"
} as CSSProperties;

export const visuallyHiddenStyle: CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px"
};
