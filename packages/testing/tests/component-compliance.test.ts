import {
  AIRole,
  AIState,
  createAIAttributes
} from "@domglyph/ai-contract";
import { describe, expect, it } from "vitest";

import { createVirtualElement, runComponentComplianceChecks } from "../src/index";

describe("@domglyph/testing component compliance", () => {
  it("fails components that omit required AI attributes", () => {
    const element = createVirtualElement({
      attributes: {
        ...createAIAttributes({
          id: "missing-role"
        }),
        role: "button"
      },
      tagName: "button",
      textContent: "Run action"
    });

    const result = runComponentComplianceChecks(element, {
      requiredAttributes: ["data-ai-id", "data-ai-role"],
      requireAccessibleName: true
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("data-ai-role is required for component compliance.");
  });

  it("accepts supported state combinations", () => {
    const element = createVirtualElement({
      attributes: {
        ...createAIAttributes({
          id: "confirm-action",
          role: AIRole.ACTION,
          state: [AIState.IDLE, AIState.SELECTED]
        }),
        "aria-label": "Confirm",
        role: "button"
      },
      tagName: "button",
      textContent: "Confirm"
    });

    const result = runComponentComplianceChecks(element, {
      allowedStates: [AIState.IDLE, AIState.SELECTED],
      expectedRole: AIRole.ACTION
    });

    expect(result.valid).toBe(true);
  });
});
