import { AIEvent } from "@domglyph/ai-contract";

import { installDOMglyphDevtools } from "./devtools";
import { installDOMglyphRuntime } from "./runtime";
import type {
  DOMglyphDevtoolsAPI,
  DOMglyphGlobalAPI,
  RuntimeRegistry
} from "./types";

export { installDOMglyphDevtools } from "./devtools";
export { DOMglyphRuntime, installDOMglyphRuntime } from "./runtime";
export type {
  AvailableAction,
  DOMglyphDevtoolsAPI,
  DOMglyphGlobalAPI,
  FormFieldSchema,
  FormSchema,
  RuntimeEventLogEntry,
  RuntimeRegistry,
  ScreenContext,
  VisibleEntity
} from "./types";

export const runtimeRegistry: RuntimeRegistry = {
  prompt: "browser-inspection-runtime",
  components: [
    "getScreenContext",
    "getAvailableActions",
    "getFormSchema",
    "getVisibleEntities",
    "getRecentEvents"
  ]
};

export const defaultRuntimeEvent = AIEvent.ACTION_TRIGGERED;

export const __DOMGLYPH__: DOMglyphGlobalAPI | null =
  typeof window === "undefined" ? null : installDOMglyphRuntime(window);

export const __DOMGLYPH_DEVTOOLS__: DOMglyphDevtoolsAPI | null =
  typeof window === "undefined" ? null : installDOMglyphDevtools(window);

declare global {
  interface Window {
    __DOMGLYPH__?: DOMglyphGlobalAPI;
    __DOMGLYPH_DEVTOOLS__?: DOMglyphDevtoolsAPI;
  }
}
