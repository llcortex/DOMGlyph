import { DATA_AI_ROLE } from "@domglyph/ai-contract";

import type { AccessibilityCheckOptions, AccessibilityCheckResult } from "./types";

export function runAccessibilityChecks(
  element: ElementLike,
  options: AccessibilityCheckOptions = {}
): AccessibilityCheckResult {
  const errors: string[] = [];
  const role = readAttribute(element, "role") ?? readAttribute(element, DATA_AI_ROLE);
  const accessibleName =
    readAttribute(element, "aria-label") ??
    readAttribute(element, "title") ??
    readTextContent(element);

  if (options.expectedRole && role !== options.expectedRole) {
    errors.push(`Expected accessible role "${options.expectedRole}" but received "${role ?? "none"}".`);
  }

  if (options.requireAccessibleName !== false && (!accessibleName || accessibleName.trim() === "")) {
    errors.push("Accessible name is required.");
  }

  if (readAttribute(element, "aria-hidden") === "true" && accessibleName) {
    errors.push("aria-hidden content should not be used as an accessible target.");
  }

  return {
    errors,
    valid: errors.length === 0
  };
}

type ElementLike = {
  readonly textContent?: string;
  getAttribute?: (name: string) => string | null;
  readonly [key: string]: unknown;
};

function readAttribute(element: ElementLike, name: string): string | undefined {
  const value = element.getAttribute?.(name);
  if (value !== null && value !== undefined) {
    return value;
  }

  const recordValue = element[name];
  return typeof recordValue === "string" ? recordValue : undefined;
}

function readTextContent(element: ElementLike): string | undefined {
  return typeof element.textContent === "string" ? element.textContent : undefined;
}
