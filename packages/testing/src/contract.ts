import {
  DATA_AI_ID,
  DATA_AI_ROLE,
  DATA_AI_STATE,
  extractAIAttributes,
  validateAIAttributes
} from "@domglyph/ai-contract";

import type {
  ComplianceCheckOptions,
  ComplianceCheckResult,
  ContractCheckResult
} from "./types";
import { runAccessibilityChecks } from "./accessibility";

export function validateAIContractNode(element: ElementLike): ContractCheckResult {
  const result = validateAIAttributes(element);

  return {
    attributes: result.attributes,
    errors: result.errors,
    valid: result.valid
  };
}

export function runComponentComplianceChecks(
  element: ElementLike,
  options: ComplianceCheckOptions = {}
): ComplianceCheckResult {
  const contract = validateAIAttributes(element);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessibility = runAccessibilityChecks(element as any, options);
  const metadata = extractAIAttributes(element);
  const errors = [...contract.errors, ...accessibility.errors];

  for (const name of options.requiredAttributes ?? []) {
    if (metadata[name as keyof typeof metadata] === undefined) {
      errors.push(`${name} is required for component compliance.`);
    }
  }

  if (options.allowedStates && metadata[DATA_AI_STATE] !== undefined) {
    const states = metadata[DATA_AI_STATE]?.split(",").map((state) => state.trim()).filter(Boolean) ?? [];
    for (const state of states) {
      if (!options.allowedStates.includes(state as never)) {
        errors.push(`${DATA_AI_STATE} contains unsupported state "${state}".`);
      }
    }
  }

  if (metadata[DATA_AI_ROLE] === undefined && metadata[DATA_AI_ID] !== undefined) {
    errors.push(`${DATA_AI_ROLE} is required when ${DATA_AI_ID} is present.`);
  }

  return {
    accessibility,
    contract,
    errors,
    valid: errors.length === 0
  };
}

type ElementLike = Parameters<typeof validateAIAttributes>[0];
