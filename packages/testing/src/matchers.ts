import { extractAIAttributes, validateAIAttributes } from "@domglyph/ai-contract";
import type { ExpectStatic } from "vitest";

import { runAccessibilityChecks } from "./accessibility";
import { serializeMetadataSnapshot } from "./snapshot";

export const cortexMatchers = {
  toBeAIContractValid(received: ElementLike) {
    const validation = validateAIAttributes(received);
    return {
      message: () =>
        validation.valid
          ? "Expected AI contract validation to fail."
          : `Expected AI contract to be valid.\n${validation.errors.join("\n")}`,
      pass: validation.valid
    };
  },
  toHaveAIAttributes(received: ElementLike, expected: Record<string, string>) {
    const attributes = extractAIAttributes(received);
    const missing = Object.entries(expected).filter(([key, value]) => attributes[key as keyof typeof attributes] !== value);
    return {
      message: () =>
        missing.length === 0
          ? "Expected AI attribute assertion to fail."
          : `Missing or mismatched attributes:\n${missing.map(([key, value]) => `${key}: ${value}`).join("\n")}`,
      pass: missing.length === 0
    };
  },
  toPassAccessibilityChecks(received: ElementLike) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = runAccessibilityChecks(received as any);
    return {
      message: () =>
        result.valid
          ? "Expected accessibility checks to fail."
          : `Expected element to pass accessibility checks.\n${result.errors.join("\n")}`,
      pass: result.valid
    };
  },
  toMatchAIMetadataSnapshot(received: { readonly target: string; readonly attributes: Record<string, string | undefined> }, expected: string) {
    const actual = serializeMetadataSnapshot({
      attributes: received.attributes,
      target: received.target
    });
    return {
      message: () => `Expected metadata snapshot to match.\nActual:\n${actual}`,
      pass: actual === expected
    };
  }
};

export function registerCortexMatchers(expect: ExpectStatic): void {
  expect.extend(cortexMatchers);
}

type ElementLike = Parameters<typeof validateAIAttributes>[0];
