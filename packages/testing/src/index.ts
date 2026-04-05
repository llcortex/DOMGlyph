export { runAccessibilityChecks } from "./accessibility";
export { runComponentComplianceChecks, validateAIContractNode } from "./contract";
export { createVirtualElement } from "./dom";
export { createActionFixture, createStatusFixture } from "./fixtures";
export { cortexMatchers, registerCortexMatchers } from "./matchers";
export { createMetadataSnapshot, serializeMetadataSnapshot } from "./snapshot";
export type {
  AccessibilityCheckOptions,
  AccessibilityCheckResult,
  ComplianceCheckOptions,
  ComplianceCheckResult,
  ContractCheckResult,
  MetadataSnapshot,
  TestHarness,
  VirtualAttribute,
  VirtualElement,
  VirtualElementOptions
} from "./types";
import type { TestHarness } from "./types";

export const harness: TestHarness = {
  name: "domglyph-ai-testkit",
  runner: "vitest"
};
