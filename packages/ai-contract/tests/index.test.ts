import { describe, expect, it } from "vitest";

import {
  AIState,
  AIRole,
  DATA_AI_ACTION,
  DATA_AI_ENTITY,
  DATA_AI_ENTITY_ID,
  DATA_AI_FIELD_TYPE,
  DATA_AI_ID,
  DATA_AI_REQUIRED,
  DATA_AI_ROLE,
  DATA_AI_STATE,
  createAIAttributes,
  extractAIAttributes,
  validateAIAttributes
} from "../src/index";

describe("@domglyph/ai-contract", () => {
  it("creates serialized attributes from typed config", () => {
    expect(
      createAIAttributes({
        id: "save-profile",
        role: AIRole.ACTION,
        action: {
          id: "save-profile",
          name: "Save profile"
        },
        state: [AIState.IDLE, AIState.SELECTED],
        required: true
      })
    ).toEqual({
      [DATA_AI_ID]: "save-profile",
      [DATA_AI_ROLE]: AIRole.ACTION,
      [DATA_AI_ACTION]: "save-profile",
      [DATA_AI_STATE]: "idle,selected",
      [DATA_AI_REQUIRED]: "true"
    });
  });

  it("extracts contract attributes from a DOM-like element", () => {
    const element = {
      dataset: {
        aiId: "email",
        aiRole: AIRole.FIELD,
        aiFieldType: "email"
      }
    };

    expect(extractAIAttributes(element)).toEqual({
      [DATA_AI_ID]: "email",
      [DATA_AI_ROLE]: AIRole.FIELD,
      [DATA_AI_FIELD_TYPE]: "email"
    });
  });

  it("reports validation errors for inconsistent contracts", () => {
    const element = {
      getAttribute(name: string): string | null {
        const attributes: Record<string, string> = {
          [DATA_AI_ROLE]: "bad-role",
          [DATA_AI_STATE]: "idle,broken",
          [DATA_AI_REQUIRED]: "maybe",
          [DATA_AI_ENTITY_ID]: "user_1"
        };

        return attributes[name] ?? null;
      }
    };

    const result = validateAIAttributes(element);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      `${DATA_AI_ID} is required when any AI contract attribute is present.`
    );
    expect(result.errors).toContain(
      `${DATA_AI_ROLE} must be one of: action, field, form, table, modal, nav-item, status, section, screen.`
    );
    expect(result.errors).toContain(
      `${DATA_AI_STATE} contains invalid state "broken". Expected one of: idle, loading, success, error, disabled, expanded, selected, empty.`
    );
    expect(result.errors).toContain(
      `${DATA_AI_REQUIRED} must be the string "true" or "false".`
    );
    expect(result.errors).toContain(
      `${DATA_AI_ENTITY} is required when ${DATA_AI_ENTITY_ID} is present.`
    );
  });
});
