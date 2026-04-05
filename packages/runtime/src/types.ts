import type { AIAction, AIAttributeMap, AIEvent } from "@domglyph/ai-contract";

export interface ScreenContext {
  readonly screenId?: string;
  readonly sectionIds: readonly string[];
  readonly url?: string;
  readonly title?: string;
  readonly visibleActionIds: readonly string[];
  readonly visibleEntityTypes: readonly string[];
}

export interface AvailableAction extends AIAction {
  readonly elementId?: string;
  readonly label?: string;
  readonly role?: string;
  readonly disabled: boolean;
  readonly state: readonly string[];
}

export interface FormFieldSchema {
  readonly id: string;
  readonly label?: string;
  readonly fieldType?: string;
  readonly required: boolean;
  readonly state: readonly string[];
  readonly placeholder?: string;
}

export interface FormSchema {
  readonly id: string;
  readonly screenId?: string;
  readonly sectionId?: string;
  readonly fields: readonly FormFieldSchema[];
  readonly submitActions: readonly AvailableAction[];
}

export interface VisibleEntity {
  readonly entity: string;
  readonly entityId?: string;
  readonly screenId?: string;
  readonly sectionId?: string;
  readonly text?: string;
}

export interface RuntimeEventLogEntry {
  readonly type: AIEvent | "mutation_observed" | "screen_context_changed";
  readonly timestamp: number;
  readonly targetId?: string;
  readonly detail?: unknown;
}

export interface RuntimeRegistry {
  readonly prompt: string;
  readonly components: readonly string[];
}

export interface DOMglyphGlobalAPI {
  getScreenContext(): ScreenContext;
  getAvailableActions(): readonly AvailableAction[];
  getFormSchema(formId: string): FormSchema | null;
  getVisibleEntities(): readonly VisibleEntity[];
  getRecentEvents(): readonly RuntimeEventLogEntry[];
}

export interface ActionRegistryEntry extends AvailableAction {
  readonly attributes: AIAttributeMap;
}

export interface DOMglyphDevtoolsAPI {
  show(): void;
  hide(): void;
  toggle(): boolean;
  destroy(): void;
  isVisible(): boolean;
}
