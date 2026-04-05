import {
  AIState,
  DATA_AI_ID,
  DATA_AI_ROLE,
  DATA_AI_STATE,
  AIRole
} from "@domglyph/ai-contract";
import { describe, expect, it } from "vitest";

import { createActionFixture, validateAIContractNode } from "../src/index";

describe("@domglyph/testing contract validation", () => {
  it("validates a compliant AI contract fixture", () => {
    const result = validateAIContractNode(createActionFixture());

    expect(result.valid).toBe(true);
    expect(result.attributes).toMatchObject({
      [DATA_AI_ID]: "save-profile-button",
      [DATA_AI_ROLE]: AIRole.ACTION,
      [DATA_AI_STATE]: AIState.IDLE
    });
  });
});
