import {
  AI_ATTRIBUTE_NAMES,
  DATA_AI_ACTION,
  DATA_AI_ID,
  DATA_AI_ROLE,
  DATA_AI_STATE,
  extractAIAttributes
} from "@domglyph/ai-contract";

import { installDOMglyphRuntime } from "./runtime";
import type { DOMglyphDevtoolsAPI, DOMglyphGlobalAPI } from "./types";

const DEVTOOLS_ROOT_ID = "domglyph-devtools-root";
const DEVTOOLS_STYLE_ID = "domglyph-devtools-style";
const INSPECT_SELECTOR = AI_ATTRIBUTE_NAMES.map((name) => `[${name}]`).join(", ");

export function installDOMglyphDevtools(
  targetWindow: Window = window
): DOMglyphDevtoolsAPI | null {
  if (typeof targetWindow === "undefined" || targetWindow.document === undefined) {
    return null;
  }

  if (targetWindow.__DOMGLYPH_DEVTOOLS__ !== undefined) {
    return targetWindow.__DOMGLYPH_DEVTOOLS__;
  }

  const runtime = targetWindow.__DOMGLYPH__ ?? installDOMglyphRuntime(targetWindow);
  if (runtime === null) {
    return null;
  }

  const devtools = new DOMglyphDevtoolsOverlay(targetWindow, runtime);
  targetWindow.__DOMGLYPH_DEVTOOLS__ = devtools;
  return devtools;
}

class DOMglyphDevtoolsOverlay implements DOMglyphDevtoolsAPI {
  private readonly doc: Document;
  private readonly root: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly detailPanel: HTMLPreElement;
  private readonly eventsPanel: HTMLPreElement;
  private readonly screenPanel: HTMLPreElement;
  private readonly hoverBox: HTMLDivElement;
  private readonly selectedBox: HTMLDivElement;
  private readonly disposeCallbacks: Array<() => void> = [];
  private hoveredElement: HTMLElement | null = null;
  private selectedElement: HTMLElement | null = null;
  private visible = false;
  private refreshTimer: number | null = null;

  constructor(
    private readonly win: Window,
    private readonly runtime: DOMglyphGlobalAPI
  ) {
    this.doc = win.document;
    ensureStyle(this.doc);

    this.root = this.doc.createElement("div");
    this.root.id = DEVTOOLS_ROOT_ID;
    this.root.style.display = "none";
    this.root.style.pointerEvents = "none";

    this.panel = this.doc.createElement("div");
    this.panel.style.position = "fixed";
    this.panel.style.top = "16px";
    this.panel.style.right = "16px";
    this.panel.style.width = "360px";
    this.panel.style.maxHeight = "calc(100vh - 32px)";
    this.panel.style.overflow = "auto";
    this.panel.style.background = "rgba(10, 19, 16, 0.94)";
    this.panel.style.color = "#effaf4";
    this.panel.style.border = "1px solid rgba(255,255,255,0.08)";
    this.panel.style.borderRadius = "18px";
    this.panel.style.boxShadow = "0 24px 80px rgba(0,0,0,0.28)";
    this.panel.style.padding = "16px";
    this.panel.style.fontFamily = "ui-sans-serif, system-ui, sans-serif";
    this.panel.style.pointerEvents = "auto";
    this.panel.style.zIndex = "2147483647";

    const title = this.doc.createElement("div");
    title.textContent = "DOMglyph Devtools";
    title.style.fontSize = "16px";
    title.style.fontWeight = "700";
    title.style.marginBottom = "12px";

    const subtitle = this.doc.createElement("div");
    subtitle.textContent = "Hover or click any AI-annotated element to inspect metadata.";
    subtitle.style.color = "rgba(239,250,244,0.72)";
    subtitle.style.fontSize = "12px";
    subtitle.style.marginBottom = "16px";

    const detailBlock = createBlock(this.doc, "Selection");
    const screenBlock = createBlock(this.doc, "Screen Context");
    const eventsBlock = createBlock(this.doc, "Recent Events");
    this.detailPanel = detailBlock.body;
    this.screenPanel = screenBlock.body;
    this.eventsPanel = eventsBlock.body;

    this.panel.append(title, subtitle, detailBlock.wrapper, screenBlock.wrapper, eventsBlock.wrapper);

    this.hoverBox = createHighlightBox(this.doc, "rgba(55, 148, 255, 0.95)");
    this.selectedBox = createHighlightBox(this.doc, "rgba(47, 201, 120, 0.95)");

    this.root.append(this.hoverBox, this.selectedBox, this.panel);
    (this.doc.body ?? this.doc.documentElement).append(this.root);

    this.attachListeners();
    this.render();
  }

  show(): void {
    if (this.visible) {
      return;
    }

    this.visible = true;
    this.root.style.display = "block";
    this.doc.documentElement.setAttribute("data-domglyph-devtools", "open");
    this.refreshTimer = this.win.setInterval(() => this.render(), 600);
    this.render();
  }

  hide(): void {
    if (!this.visible) {
      return;
    }

    this.visible = false;
    this.root.style.display = "none";
    this.doc.documentElement.removeAttribute("data-domglyph-devtools");
    if (this.refreshTimer !== null) {
      this.win.clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  toggle(): boolean {
    if (this.visible) {
      this.hide();
      return false;
    }

    this.show();
    return true;
  }

  destroy(): void {
    this.hide();
    for (const dispose of this.disposeCallbacks) {
      dispose();
    }
    this.root.remove();
    if (this.win.__DOMGLYPH_DEVTOOLS__ === this) {
      delete this.win.__DOMGLYPH_DEVTOOLS__;
    }
  }

  isVisible(): boolean {
    return this.visible;
  }

  private attachListeners(): void {
    const onMouseMove = (event: MouseEvent) => {
      const next = event.target instanceof Element
        ? event.target.closest<HTMLElement>(INSPECT_SELECTOR)
        : null;
      this.hoveredElement = next;
      this.updateBox(this.hoverBox, next);
      if (!this.selectedElement) {
        this.renderSelection(next);
      }
    };

    const onClick = (event: MouseEvent) => {
      const next = event.target instanceof Element
        ? event.target.closest<HTMLElement>(INSPECT_SELECTOR)
        : null;
      if (next === null) {
        return;
      }

      this.selectedElement = next;
      this.updateBox(this.selectedBox, next);
      this.renderSelection(next);
    };

    const onScrollOrResize = () => {
      this.updateBox(this.hoverBox, this.hoveredElement);
      this.updateBox(this.selectedBox, this.selectedElement);
    };

    this.doc.addEventListener("mousemove", onMouseMove, true);
    this.doc.addEventListener("click", onClick, true);
    this.win.addEventListener("scroll", onScrollOrResize, true);
    this.win.addEventListener("resize", onScrollOrResize);

    this.disposeCallbacks.push(() => this.doc.removeEventListener("mousemove", onMouseMove, true));
    this.disposeCallbacks.push(() => this.doc.removeEventListener("click", onClick, true));
    this.disposeCallbacks.push(() => this.win.removeEventListener("scroll", onScrollOrResize, true));
    this.disposeCallbacks.push(() => this.win.removeEventListener("resize", onScrollOrResize));
  }

  private updateBox(box: HTMLDivElement, element: HTMLElement | null): void {
    if (element === null || !this.visible) {
      box.style.display = "none";
      return;
    }

    const rect = element.getBoundingClientRect();
    box.style.display = rect.width > 0 && rect.height > 0 ? "block" : "none";
    box.style.transform = `translate(${rect.left + this.win.scrollX}px, ${rect.top + this.win.scrollY}px)`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;
  }

  private render(): void {
    if (!this.visible) {
      return;
    }

    this.screenPanel.textContent = formatJSON(this.runtime.getScreenContext());
    this.eventsPanel.textContent = formatJSON(this.runtime.getRecentEvents().slice(0, 12));
    this.renderSelection(this.selectedElement ?? this.hoveredElement);
    this.updateBox(this.hoverBox, this.hoveredElement);
    this.updateBox(this.selectedBox, this.selectedElement);
  }

  private renderSelection(element: HTMLElement | null): void {
    if (element === null) {
      this.detailPanel.textContent = "No AI-annotated element selected.";
      return;
    }

    const attrs = extractAIAttributes(element);
    const payload = {
      id: attrs[DATA_AI_ID],
      role: attrs[DATA_AI_ROLE],
      action: attrs[DATA_AI_ACTION],
      state: attrs[DATA_AI_STATE],
      tagName: element.tagName.toLowerCase(),
      text: element.textContent?.trim().slice(0, 160) || undefined,
      attributes: attrs
    };

    this.detailPanel.textContent = formatJSON(payload);
  }
}

function ensureStyle(doc: Document): void {
  if (doc.getElementById(DEVTOOLS_STYLE_ID) !== null) {
    return;
  }

  const style = doc.createElement("style");
  style.id = DEVTOOLS_STYLE_ID;
  style.textContent = `
    html[data-domglyph-devtools="open"] ${INSPECT_SELECTOR} {
      outline: 1px dashed rgba(47, 201, 120, 0.45);
      outline-offset: 2px;
    }
  `;
  (doc.head ?? doc.documentElement).append(style);
}

function createBlock(doc: Document, label: string): {
  readonly wrapper: HTMLDivElement;
  readonly body: HTMLPreElement;
} {
  const wrapper = doc.createElement("div");
  wrapper.style.marginBottom = "14px";

  const heading = doc.createElement("div");
  heading.textContent = label;
  heading.style.fontSize = "11px";
  heading.style.letterSpacing = "0.14em";
  heading.style.textTransform = "uppercase";
  heading.style.color = "rgba(239,250,244,0.62)";
  heading.style.marginBottom = "8px";

  const body = doc.createElement("pre");
  body.style.margin = "0";
  body.style.padding = "12px";
  body.style.borderRadius = "12px";
  body.style.background = "rgba(255,255,255,0.05)";
  body.style.border = "1px solid rgba(255,255,255,0.08)";
  body.style.font = "12px/1.45 SFMono-Regular, Consolas, monospace";
  body.style.whiteSpace = "pre-wrap";
  body.style.wordBreak = "break-word";

  wrapper.append(heading, body);
  return { body, wrapper };
}

function createHighlightBox(doc: Document, color: string): HTMLDivElement {
  const box = doc.createElement("div");
  box.style.position = "absolute";
  box.style.top = "0";
  box.style.left = "0";
  box.style.pointerEvents = "none";
  box.style.border = `2px solid ${color}`;
  box.style.background = color.replace("0.95", "0.08");
  box.style.borderRadius = "10px";
  box.style.boxShadow = `0 0 0 1px ${color}`;
  box.style.zIndex = "2147483646";
  box.style.display = "none";
  return box;
}

function formatJSON(value: unknown): string {
  return JSON.stringify(value, null, 2) ?? "null";
}
