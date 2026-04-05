import { describe, expect, it } from "vitest";

import { createStatusFixture, createVirtualElement, runAccessibilityChecks } from "../src/index";

describe("@domglyph/testing accessibility", () => {
  it("passes status fixtures with accessible role and text", () => {
    const result = runAccessibilityChecks(createStatusFixture(), {
      requireAccessibleName: true
    });

    expect(result.valid).toBe(true);
  });

  it("reports missing accessible names", () => {
    const element = createVirtualElement({
      attributes: {
        role: "button"
      },
      tagName: "button"
    });

    const result = runAccessibilityChecks(element);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Accessible name is required.");
  });
});
