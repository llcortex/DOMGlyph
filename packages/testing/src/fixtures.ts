import {
  AIEvent,
  AIRole,
  AIState,
  createAIAttributes
} from "@domglyph/ai-contract";

import { createVirtualElement } from "./dom";

export function createActionFixture() {
  return createVirtualElement({
    attributes: {
      ...createAIAttributes({
        action: {
          expectedOutcome: "Profile saved",
          id: "save-profile",
          name: "Save profile"
        },
        id: "save-profile-button",
        role: AIRole.ACTION,
        state: [AIState.IDLE]
      }),
      "aria-label": "Save profile",
      role: "button"
    },
    tagName: "button",
    textContent: "Save profile"
  });
}

export function createStatusFixture() {
  return createVirtualElement({
    attributes: {
      ...createAIAttributes({
        event: AIEvent.ACTION_COMPLETED,
        id: "save-status",
        role: AIRole.STATUS,
        state: AIState.SUCCESS,
        status: "success"
      }),
      role: "status"
    },
    textContent: "Profile saved"
  });
}
