import {
  AIEvent,
  AIRole,
  DATA_AI_ACTION,
  DATA_AI_ENTITY,
  DATA_AI_ENTITY_ID,
  DATA_AI_EVENT,
  DATA_AI_FEEDBACK,
  DATA_AI_FIELD_TYPE,
  DATA_AI_ID,
  DATA_AI_REQUIRED,
  DATA_AI_RESULT,
  DATA_AI_ROLE,
  DATA_AI_SCREEN,
  DATA_AI_SECTION,
  DATA_AI_STATE,
  DATA_AI_STATUS,
  extractAIAttributes
} from "@domglyph/ai-contract";

import type {
  ActionRegistryEntry,
  AvailableAction,
  DOMglyphGlobalAPI,
  FormFieldSchema,
  FormSchema,
  RuntimeEventLogEntry,
  ScreenContext,
  VisibleEntity
} from "./types";

const ACTION_SELECTOR = `[${DATA_AI_ACTION}]`;
const EVENT_SELECTOR = `[${DATA_AI_EVENT}]`;
const SCREEN_SELECTOR = `[${DATA_AI_SCREEN}]`;
const SECTION_SELECTOR = `[${DATA_AI_SECTION}]`;
const ENTITY_SELECTOR = `[${DATA_AI_ENTITY}]`;
const FIELD_SELECTOR = `input, textarea, select, [${DATA_AI_ROLE}="${AIRole.FIELD}"]`;
const FORM_SELECTOR = `form, [${DATA_AI_ROLE}="${AIRole.FORM}"]`;
const MAX_EVENT_LOG = 100;

export class DOMglyphRuntime implements DOMglyphGlobalAPI {
  private readonly actionRegistry = new Map<string, ActionRegistryEntry>();
  private readonly recentEvents: RuntimeEventLogEntry[] = [];
  private mutationObserver: MutationObserver | null = null;
  private lastScreenSignature = "";

  constructor(
    private readonly win: Window,
    private readonly doc: Document
  ) {
    this.refreshActionRegistry();
    this.lastScreenSignature = this.buildScreenSignature();
    this.attachEventListeners();
    this.attachMutationObserver();
  }

  getScreenContext(): ScreenContext {
    const screenElement = this.getVisibleElements(SCREEN_SELECTOR)[0];
    const sectionIds = unique(
      this.getVisibleElements(SECTION_SELECTOR)
        .map((element) => element.getAttribute(DATA_AI_SECTION) ?? undefined)
        .filter(isDefined)
    );
    const visibleActionIds = this.getAvailableActions().map((action) => action.id);
    const visibleEntityTypes = unique(
      this.getVisibleEntities().map((entity) => entity.entity)
    );

    return {
      screenId: screenElement?.getAttribute(DATA_AI_SCREEN) ?? undefined,
      sectionIds,
      title: this.doc.title || undefined,
      url: this.win.location.href,
      visibleActionIds,
      visibleEntityTypes
    };
  }

  getAvailableActions(): readonly AvailableAction[] {
    this.refreshActionRegistry();
    return Array.from(this.actionRegistry.values()).map(({ attributes, ...action }) => action);
  }

  getFormSchema(formId: string): FormSchema | null {
    const formElement =
      this.doc.getElementById(formId) ??
      this.doc.querySelector<HTMLElement>(`${FORM_SELECTOR}[${DATA_AI_ID}="${cssEscape(formId)}"]`);

    if (formElement === null) {
      return null;
    }

    const formAttributes = extractAIAttributes(formElement);
    const screenId = formElement.closest<HTMLElement>(SCREEN_SELECTOR)?.getAttribute(DATA_AI_SCREEN) ?? undefined;
    const sectionId =
      formElement.closest<HTMLElement>(SECTION_SELECTOR)?.getAttribute(DATA_AI_SECTION) ?? undefined;

    const fields = Array.from(formElement.querySelectorAll<HTMLElement>(FIELD_SELECTOR))
      .filter((element) => isVisible(element))
      .map((field) => this.extractFieldSchema(field))
      .filter(isDefined);

    const submitActions = Array.from(formElement.querySelectorAll<HTMLElement>(ACTION_SELECTOR))
      .filter((element) => isVisible(element))
      .map((element) => this.buildActionEntry(element))
      .filter(isDefined)
      .map(({ attributes, ...action }) => action);

    return {
      fields,
      id: formAttributes[DATA_AI_ID] ?? formElement.id ?? formId,
      screenId,
      sectionId,
      submitActions
    };
  }

  getVisibleEntities(): readonly VisibleEntity[] {
    return this.getVisibleElements(ENTITY_SELECTOR).map((element) => {
      const attributes = extractAIAttributes(element);
      return {
        entity: attributes[DATA_AI_ENTITY] ?? "unknown",
        entityId: attributes[DATA_AI_ENTITY_ID],
        screenId:
          element.closest<HTMLElement>(SCREEN_SELECTOR)?.getAttribute(DATA_AI_SCREEN) ?? undefined,
        sectionId:
          element.closest<HTMLElement>(SECTION_SELECTOR)?.getAttribute(DATA_AI_SECTION) ?? undefined,
        text: textPreview(element)
      };
    });
  }

  getRecentEvents(): readonly RuntimeEventLogEntry[] {
    return [...this.recentEvents];
  }

  private attachEventListeners(): void {
    this.doc.addEventListener(
      "click",
      (event) => {
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>(ACTION_SELECTOR) : null;
        if (target === null) {
          return;
        }

        const action = this.buildActionEntry(target);
        if (action !== null) {
          this.logEvent(AIEvent.ACTION_TRIGGERED, action.id, {
            action: action.name,
            disabled: action.disabled
          });
        }
      },
      true
    );

    this.doc.addEventListener(
      "input",
      (event) => {
        const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>(FIELD_SELECTOR) : null;
        if (target === null) {
          return;
        }

        const attributes = extractAIAttributes(target);
        this.logEvent(AIEvent.FIELD_UPDATED, attributes[DATA_AI_ID], {
          fieldType: attributes[DATA_AI_FIELD_TYPE],
          required: attributes[DATA_AI_REQUIRED]
        });
      },
      true
    );

    this.doc.addEventListener(
      "submit",
      (event) => {
        const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>(FORM_SELECTOR) : null;
        if (target === null) {
          return;
        }

        const attributes = extractAIAttributes(target);
        const formId = attributes[DATA_AI_ID] ?? (target.id || undefined);
        this.logEvent(AIEvent.FORM_SUBMITTED, formId);
      },
      true
    );
  }

  private attachMutationObserver(): void {
    if (typeof MutationObserver === "undefined") {
      return;
    }

    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldRefreshActions = false;
      let shouldCheckScreen = false;

      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
          shouldRefreshActions = shouldRefreshActions || mutation.target.matches(ACTION_SELECTOR);
          shouldCheckScreen =
            shouldCheckScreen ||
            mutation.target.hasAttribute(DATA_AI_SCREEN) ||
            mutation.target.hasAttribute(DATA_AI_SECTION);

          this.logMutationMetadata(mutation.target);
        }

        if (mutation.type === "childList") {
          shouldRefreshActions = true;
          shouldCheckScreen = true;

          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              this.logMutationMetadata(node);
            }
          });
        }
      }

      if (shouldRefreshActions) {
        this.refreshActionRegistry();
      }

      if (shouldCheckScreen) {
        const nextSignature = this.buildScreenSignature();
        if (nextSignature !== this.lastScreenSignature) {
          this.lastScreenSignature = nextSignature;
          this.logEvent("screen_context_changed", undefined, this.getScreenContext());
        }
      }
    });

    const root = this.doc.body ?? this.doc.documentElement;

    this.mutationObserver.observe(root, {
      attributes: true,
      attributeFilter: [
        DATA_AI_ACTION,
        DATA_AI_EVENT,
        DATA_AI_ID,
        DATA_AI_SCREEN,
        DATA_AI_SECTION,
        DATA_AI_STATE,
        DATA_AI_STATUS
      ],
      childList: true,
      subtree: true
    });
  }

  private logMutationMetadata(root: HTMLElement): void {
    const eventNodes = [
      ...(root.matches(EVENT_SELECTOR) ? [root] : []),
      ...Array.from(root.querySelectorAll<HTMLElement>(EVENT_SELECTOR))
    ];

    for (const node of eventNodes) {
      const attributes = extractAIAttributes(node);
      const eventType = attributes[DATA_AI_EVENT] as AIEvent | undefined;
      if (eventType !== undefined) {
        this.logEvent(eventType, attributes[DATA_AI_ID], {
          feedback: attributes[DATA_AI_FEEDBACK],
          status: attributes[DATA_AI_STATUS]
        });
      }
    }

    if (eventNodes.length > 0) {
      this.logEvent("mutation_observed", undefined, {
        nodes: eventNodes.length
      });
    }
  }

  private refreshActionRegistry(): void {
    this.actionRegistry.clear();

    for (const element of this.getVisibleElements(ACTION_SELECTOR)) {
      const action = this.buildActionEntry(element);
      if (action !== null) {
        this.actionRegistry.set(action.id, action);
      }
    }
  }

  private buildActionEntry(element: HTMLElement): ActionRegistryEntry | null {
    const attributes = extractAIAttributes(element);
    const actionId = attributes[DATA_AI_ACTION];
    if (actionId === undefined) {
      return null;
    }

    const state = parseStates(attributes[DATA_AI_STATE]);
    const disabled =
      state.includes("disabled") ||
      element.matches(":disabled") ||
      element.getAttribute("aria-disabled") === "true";

    return {
      attributes,
      disabled,
      elementId: attributes[DATA_AI_ID],
      expectedOutcome: attributes[DATA_AI_RESULT],
      id: actionId,
      label: textPreview(element),
      name: actionId,
      role: attributes[DATA_AI_ROLE],
      state,
      target: describeTarget(element)
    };
  }

  private extractFieldSchema(field: HTMLElement): FormFieldSchema | null {
    const attributes = extractAIAttributes(field);
    const fieldId = attributes[DATA_AI_ID] ?? field.getAttribute("id") ?? undefined;
    if (fieldId === undefined) {
      return null;
    }

    const htmlField = field as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    return {
      fieldType: attributes[DATA_AI_FIELD_TYPE] ?? ("type" in htmlField ? htmlField.type : undefined),
      id: fieldId,
      label: findLabelText(field),
      placeholder: "placeholder" in htmlField ? htmlField.placeholder || undefined : undefined,
      required:
        attributes[DATA_AI_REQUIRED] === "true" ||
        ("required" in htmlField && Boolean(htmlField.required)),
      state: parseStates(attributes[DATA_AI_STATE])
    };
  }

  private getVisibleElements<T extends HTMLElement = HTMLElement>(selector: string): T[] {
    return Array.from(this.doc.querySelectorAll<T>(selector)).filter((element) => isVisible(element));
  }

  private buildScreenSignature(): string {
    const context = this.getScreenContext();
    return JSON.stringify(context);
  }

  private logEvent(
    type: RuntimeEventLogEntry["type"],
    targetId?: string,
    detail?: RuntimeEventLogEntry["detail"]
  ): void {
    this.recentEvents.unshift({
      detail,
      targetId,
      timestamp: Date.now(),
      type
    });

    if (this.recentEvents.length > MAX_EVENT_LOG) {
      this.recentEvents.length = MAX_EVENT_LOG;
    }
  }
}

export function installDOMglyphRuntime(targetWindow: Window = window): DOMglyphGlobalAPI | null {
  if (typeof targetWindow === "undefined" || targetWindow.document === undefined) {
    return null;
  }

  if (targetWindow.__DOMGLYPH__ !== undefined) {
    return targetWindow.__DOMGLYPH__;
  }

  const runtime = new DOMglyphRuntime(targetWindow, targetWindow.document);
  targetWindow.__DOMGLYPH__ = runtime;
  return runtime;
}

function parseStates(value: string | undefined): string[] {
  return value?.split(",").map((state) => state.trim()).filter(Boolean) ?? [];
}

function describeTarget(element: HTMLElement): string | undefined {
  const href = element.getAttribute("href");
  if (href) {
    return href;
  }

  const target = element.getAttribute("aria-controls");
  if (target) {
    return target;
  }

  return element.getAttribute(DATA_AI_SECTION) ?? undefined;
}

function findLabelText(field: HTMLElement): string | undefined {
  const id = field.getAttribute("id");
  if (id !== null) {
    const label = field.ownerDocument?.querySelector<HTMLLabelElement>(`label[for="${cssEscape(id)}"]`);
    if (label) {
      return textPreview(label);
    }
  }

  return textPreview(field.closest("label"));
}

function textPreview(node: Element | null): string | undefined {
  const value = node?.textContent?.replace(/\s+/g, " ").trim();
  return value ? value.slice(0, 160) : undefined;
}

function isVisible(element: HTMLElement): boolean {
  const style = element.ownerDocument?.defaultView?.getComputedStyle(element);
  if (style && (style.display === "none" || style.visibility === "hidden")) {
    return false;
  }

  if (element.hidden || element.getAttribute("aria-hidden") === "true") {
    return false;
  }

  if (typeof element.getClientRects !== "function") {
    return true;
  }

  return element.getClientRects().length > 0 || element === element.ownerDocument?.body;
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== undefined && value !== null;
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }

  return value.replace(/["\\]/g, "\\$&");
}
