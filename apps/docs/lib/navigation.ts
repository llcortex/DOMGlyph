export interface NavItem {
  title: string;
  href: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  badge?: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "Introduction",
    items: [
      { title: "What is DOMglyph", href: "/docs/introduction/what-is-cortexui" },
      { title: "Why DOMglyph exists", href: "/docs/introduction/why-cortexui" },
      { title: "Core philosophy", href: "/docs/introduction/philosophy" },
      { title: "AI-native UI explained", href: "/docs/introduction/ai-native-ui" },
      { title: "vs Traditional systems", href: "/docs/introduction/comparison" }
    ]
  },
  {
    title: "Getting Started",
    items: [
      { title: "Installation", href: "/docs/getting-started/installation" },
      { title: "Project setup", href: "/docs/getting-started/project-setup" },
      { title: "First component", href: "/docs/getting-started/first-component" },
      { title: "Using with React", href: "/docs/getting-started/react" },
      { title: "Using with Vanilla JS", href: "/docs/getting-started/vanilla-js" }
    ]
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Human UI vs AI-native UI", href: "/docs/concepts/human-vs-ai" },
      { title: "UI as API", href: "/docs/concepts/ui-as-api" },
      { title: "Deterministic interfaces", href: "/docs/concepts/deterministic" },
      { title: "Action-driven design", href: "/docs/concepts/action-driven" },
      { title: "State visibility", href: "/docs/concepts/state-visibility" },
      { title: "Screen awareness", href: "/docs/concepts/screen-awareness" },
      { title: "Interaction contracts", href: "/docs/concepts/interaction-contracts" }
    ]
  },
  {
    title: "AI Contract",
    badge: "Core",
    items: [
      { title: "Overview", href: "/docs/ai-contract/overview" },
      { title: "data-ai-* attributes", href: "/docs/ai-contract/attributes" },
      { title: "Roles", href: "/docs/ai-contract/roles" },
      { title: "States", href: "/docs/ai-contract/states" },
      { title: "Actions", href: "/docs/ai-contract/actions" },
      { title: "Events", href: "/docs/ai-contract/events" },
      { title: "Screen structure", href: "/docs/ai-contract/screen-structure" },
      { title: "Form schema", href: "/docs/ai-contract/form-schema" },
      { title: "Entity modeling", href: "/docs/ai-contract/entity-modeling" },
      { title: "Best practices", href: "/docs/ai-contract/best-practices" }
    ]
  },
  {
    title: "Components",
    items: [
      { title: "ActionButton", href: "/docs/components/action-button" },
      { title: "FormField", href: "/docs/components/form-field" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Select", href: "/docs/components/select" },
      { title: "StatusBanner", href: "/docs/components/status-banner" },
      { title: "DataTable", href: "/docs/components/data-table" },
      { title: "ConfirmDialog", href: "/docs/components/confirm-dialog" },
      { title: "Tabs", href: "/docs/components/tabs" },
      { title: "Modal", href: "/docs/components/modal" },
      { title: "Navigation", href: "/docs/components/navigation" }
    ]
  },
  {
    title: "Primitives",
    items: [
      { title: "Box", href: "/docs/primitives/box" },
      { title: "Stack", href: "/docs/primitives/stack" },
      { title: "Text", href: "/docs/primitives/text" },
      { title: "ButtonBase", href: "/docs/primitives/button-base" },
      { title: "InputBase", href: "/docs/primitives/input-base" },
      { title: "DialogBase", href: "/docs/primitives/dialog-base" }
    ]
  },
  {
    title: "Runtime",
    badge: "AI Layer",
    items: [
      { title: "Overview", href: "/docs/runtime/overview" },
      { title: "getScreenContext()", href: "/docs/runtime/get-screen-context" },
      { title: "getAvailableActions()", href: "/docs/runtime/get-available-actions" },
      { title: "getFormSchema()", href: "/docs/runtime/get-form-schema" },
      { title: "getRecentEvents()", href: "/docs/runtime/get-recent-events" }
    ]
  },
  {
    title: "Patterns",
    items: [
      { title: "Forms (create/edit)", href: "/docs/patterns/forms" },
      { title: "Search flows", href: "/docs/patterns/search" },
      { title: "CRUD flows", href: "/docs/patterns/crud" },
      { title: "Confirmation flows", href: "/docs/patterns/confirmation" },
      { title: "Navigation flows", href: "/docs/patterns/navigation" },
      { title: "Dashboard layouts", href: "/docs/patterns/dashboard" }
    ]
  },
  {
    title: "Accessibility",
    items: [
      { title: "ARIA usage", href: "/docs/accessibility/aria" },
      { title: "Keyboard navigation", href: "/docs/accessibility/keyboard" },
      { title: "Screen readers", href: "/docs/accessibility/screen-readers" },
      { title: "Contrast rules", href: "/docs/accessibility/contrast" }
    ]
  },
  {
    title: "Testing",
    items: [
      { title: "Contract validation", href: "/docs/testing/contract-validation" },
      { title: "Component testing", href: "/docs/testing/components" },
      { title: "Accessibility testing", href: "/docs/testing/accessibility" },
      { title: "Flow testing", href: "/docs/testing/flows" }
    ]
  },
  {
    title: "Devtools",
    items: [
      { title: "Inspector overview", href: "/docs/devtools/inspector" },
      { title: "Debugging AI metadata", href: "/docs/devtools/debugging" },
      { title: "Event logs", href: "/docs/devtools/events" }
    ]
  },
  {
    title: "Advanced",
    items: [
      { title: "Custom AI contracts", href: "/docs/advanced/custom-contracts" },
      { title: "Extending components", href: "/docs/advanced/extending" },
      { title: "Integrating with agents", href: "/docs/advanced/agent-integration" },
      { title: "Multi-agent scenarios", href: "/docs/advanced/multi-agent" }
    ]
  },
  {
    title: "Philosophy",
    badge: "Manifesto",
    items: [
      { title: "Why UI must evolve", href: "/docs/philosophy/evolution" },
      { title: "Problems with current UIs", href: "/docs/philosophy/problems" },
      { title: "UI as machine interface", href: "/docs/philosophy/ui-as-interface" },
      { title: "Determinism vs heuristics", href: "/docs/philosophy/determinism" },
      { title: "Future of AI + browsers", href: "/docs/philosophy/future" }
    ]
  },
  {
    title: "Roadmap",
    items: [
      { title: "Upcoming features", href: "/docs/roadmap/upcoming" },
      { title: "Long-term vision", href: "/docs/roadmap/vision" }
    ]
  }
];
