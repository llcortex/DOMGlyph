import type {
  AIAttributeElement,
  AIAttributeMap,
  AIAttributeValidationResult,
  AIRole,
  AIState
} from "@domglyph/ai-contract";

export interface TestHarness {
  readonly name: string;
  readonly runner: "vitest";
}

export interface VirtualAttribute {
  readonly name: string;
  readonly value: string;
}

export interface VirtualElementOptions {
  readonly tagName?: string;
  readonly textContent?: string;
  readonly hidden?: boolean;
  readonly attributes?: Record<string, string | undefined>;
}

export interface VirtualElement extends AIAttributeElement {
  readonly tagName: string;
  readonly textContent: string;
  readonly hidden: boolean;
  readonly attributes: readonly VirtualAttribute[];
  getAttribute(name: string): string | null;
  hasAttribute(name: string): boolean;
}

export interface ContractCheckResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly attributes: AIAttributeMap;
}

export interface AccessibilityCheckOptions {
  readonly expectedRole?: AIRole;
  readonly requireAccessibleName?: boolean;
}

export interface AccessibilityCheckResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export interface ComplianceCheckOptions extends AccessibilityCheckOptions {
  readonly requiredAttributes?: readonly string[];
  readonly allowedStates?: readonly AIState[];
}

export interface ComplianceCheckResult {
  readonly valid: boolean;
  readonly contract: AIAttributeValidationResult;
  readonly accessibility: AccessibilityCheckResult;
  readonly errors: readonly string[];
}

export interface MetadataSnapshot {
  readonly target: string;
  readonly attributes: AIAttributeMap;
}
