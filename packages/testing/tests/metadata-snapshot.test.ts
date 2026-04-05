import { describe, expect, it } from "vitest";

import {
  createActionFixture,
  createMetadataSnapshot,
  registerCortexMatchers,
  serializeMetadataSnapshot
} from "../src/index";

registerCortexMatchers(expect);

describe("@domglyph/testing metadata snapshots and matchers", () => {
  it("serializes stable metadata snapshots", () => {
    const snapshot = createMetadataSnapshot("action-button", createActionFixture());

    expect(serializeMetadataSnapshot(snapshot)).toMatchInlineSnapshot(`
"{
  \\"target\\": \\"action-button\\",
  \\"attributes\\": {
    \\"data-ai-id\\": \\"save-profile-button\\",
    \\"data-ai-role\\": \\"action\\",
    \\"data-ai-action\\": \\"save-profile\\",
    \\"data-ai-state\\": \\"idle\\"
  }
}"
`);
  });

  it("supports custom AI-aware matchers", () => {
    const element = createActionFixture();

    expect(element).toBeAIContractValid();
    expect(element).toHaveAIAttributes({
      "data-ai-action": "save-profile",
      "data-ai-id": "save-profile-button"
    });
    expect(element).toPassAccessibilityChecks();
  });
});
