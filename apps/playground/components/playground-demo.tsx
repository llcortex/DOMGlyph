"use client";

import {
  ActionButton,
  ConfirmDialog,
  DataTable,
  FormField,
  StatusBanner
} from "@domglyph/components";
import { Box, Stack, Text } from "@domglyph/primitives";
import { CORTEX_UI, CORTEX_UI_DEVTOOLS, installDOMglyphDevtools } from "@domglyph/runtime";
import { useEffect, useState } from "react";

type PersonRow = {
  id: string;
  name: string;
  role: string;
  status: string;
};

const rows: readonly PersonRow[] = [
  { id: "usr_001", name: "Mina Patel", role: "Designer", status: "Active" },
  { id: "usr_002", name: "Theo Walsh", role: "Engineer", status: "Pending" },
  { id: "usr_003", name: "Aya Santos", role: "Ops", status: "Active" }
];

export function PlaygroundDemo(): JSX.Element {
  const [email, setEmail] = useState("mina@domglyph.dev");
  const [status, setStatus] = useState<"success" | "error" | "info">("info");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<Record<string, string>>({});
  const [runtimeSnapshot, setRuntimeSnapshot] = useState<{
    actions: readonly unknown[];
    entities: readonly unknown[];
    events: readonly unknown[];
    screen: unknown;
  }>({
    actions: [],
    entities: [],
    events: [],
    screen: null
  });

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const element = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>("[data-ai-id]") : null;
      if (element === null) {
        return;
      }

      const entries = Array.from(element.attributes)
        .filter((attribute) => attribute.name.startsWith("data-ai-"))
        .reduce<Record<string, string>>((accumulator, attribute) => {
          accumulator[attribute.name] = attribute.value;
          return accumulator;
        }, {});

      setSelectedMeta(entries);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  useEffect(() => {
    const syncRuntime = () => {
      const runtime = CORTEX_UI ?? window.CORTEX_UI;
      if (!runtime) {
        return;
      }

      setRuntimeSnapshot({
        actions: runtime.getAvailableActions(),
        entities: runtime.getVisibleEntities(),
        events: runtime.getRecentEvents().slice(0, 8),
        screen: runtime.getScreenContext()
      });
    };

    syncRuntime();
    const interval = window.setInterval(syncRuntime, 700);
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <main style={{ padding: "28px" }}>
      <div
        style={{
          display: "grid",
          gap: "22px",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          margin: "0 auto",
          maxWidth: "1380px"
        }}
      >
        <section style={{ display: "grid", gap: "22px" }}>
          <header
            style={{
              background: "var(--play-surface)",
              border: "1px solid var(--play-line)",
              borderRadius: "28px",
              padding: "28px"
            }}
          >
            <p style={{ color: "var(--play-accent)", letterSpacing: "0.18em", margin: 0, textTransform: "uppercase" }}>
              Interactive Demo
            </p>
            <h1 style={{ fontSize: "3rem", margin: "12px 0" }}>Playground</h1>
            <p style={{ color: "var(--play-muted)", margin: 0, maxWidth: "64ch" }}>
              This surface renders AI-aware components and lets you inspect the runtime view of the
              page as you interact with forms, tables, and actions.
            </p>
            <div style={{ marginTop: "18px" }}>
              <ActionButton
                action={{ id: "toggle-devtools", name: "Toggle devtools overlay" }}
                aiState={devtoolsOpen ? "selected" : "idle"}
                onClick={() => {
                  const devtools =
                    CORTEX_UI_DEVTOOLS ?? window.CORTEX_UI_DEVTOOLS ?? installDOMglyphDevtools(window);
                  const nextState = devtools?.toggle() ?? false;
                  setDevtoolsOpen(nextState);
                }}
              >
                {devtoolsOpen ? "Hide Inspector" : "Show Inspector"}
              </ActionButton>
            </div>
          </header>

          <StatusBanner
            aiId="playground-banner"
            status={status}
            title="Runtime-ready components"
          >
            Switch states by submitting the form or triggering dialog actions.
          </StatusBanner>

          <Box
            data-ai-screen="playground"
            data-ai-section="workspace"
            style={{
              background: "var(--play-surface)",
              border: "1px solid var(--play-line)",
              borderRadius: "28px",
              padding: "28px"
            }}
          >
            <Stack gap="24px">
              <Box as="form" data-ai-id="profile-form" data-ai-role="form">
                <Stack gap="18px">
                  <Text as="h2" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                    Profile Form
                  </Text>
                  <FormField
                    fieldId="profile-email"
                    fieldType="email"
                    hint="This field is exposed to the runtime through the AI contract."
                    label="Email"
                    onChange={(event) => {
                      setEmail(event.currentTarget.value);
                      setStatus("info");
                    }}
                    required
                    successMessage={email.includes("@") ? "Email format looks valid." : undefined}
                    value={email}
                  />
                  <Stack direction="row" gap="12px">
                    <ActionButton
                      action={{ id: "save-profile", name: "Save profile", expectedOutcome: "Profile saved" }}
                      aiState="idle"
                      onClick={() => {
                        setStatus(email.includes("@") ? "success" : "error");
                      }}
                    >
                      Save Profile
                    </ActionButton>
                    <ActionButton
                      action={{ id: "open-confirm", name: "Open confirm dialog" }}
                      aiState="idle"
                      onClick={() => {
                        setDialogOpen(true);
                      }}
                    >
                      Review Change
                    </ActionButton>
                  </Stack>
                </Stack>
              </Box>

              <DataTable
                aiId="team-table"
                caption="Visible entities are harvested directly from this table."
                columns={[
                  { header: "Name", key: "name" },
                  { header: "Role", key: "role" },
                  { header: "Status", key: "status" }
                ]}
                entity="team-member"
                rows={rows}
              />
            </Stack>
          </Box>
        </section>

        <aside
          style={{
            alignSelf: "start",
            background: "rgba(15, 35, 23, 0.92)",
            borderRadius: "28px",
            color: "#eef7ef",
            padding: "24px",
            position: "sticky",
            top: "24px"
          }}
        >
          <Stack gap="18px">
            <Text as="h2" style={{ fontSize: "1.35rem", fontWeight: 700 }}>
              Debug Panel
            </Text>
            <DebugBlock label="Selected AI metadata" value={selectedMeta} />
            <DebugBlock label="Screen context" value={runtimeSnapshot.screen} />
            <DebugBlock label="Available actions" value={runtimeSnapshot.actions} />
            <DebugBlock label="Visible entities" value={runtimeSnapshot.entities} />
            <DebugBlock label="Recent events" value={runtimeSnapshot.events} />
          </Stack>
        </aside>
      </div>

      <ConfirmDialog
        aiId="confirm-profile-dialog"
        cancelAction={{ id: "cancel-profile-review", name: "Cancel profile review" }}
        confirmAction={{ id: "confirm-profile-review", name: "Confirm profile review" }}
        description="This dialog demonstrates confirm and cancel actions with explicit AI metadata."
        onCancel={() => {
          setDialogOpen(false);
          setStatus("info");
        }}
        onConfirm={() => {
          setDialogOpen(false);
          setStatus("success");
        }}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm profile update"
      />
    </main>
  );
}

function DebugBlock({
  label,
  value
}: Readonly<{
  label: string;
  value: unknown;
}>): JSX.Element {
  return (
    <Box
      style={{
        background: "rgba(255, 255, 255, 0.06)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "18px",
        padding: "14px"
      }}
    >
      <Text as="p" style={{ color: "#95b4a3", fontSize: "0.82rem", letterSpacing: "0.12em", marginBottom: "8px", textTransform: "uppercase" }}>
        {label}
      </Text>
      <pre
        style={{
          fontFamily: "SFMono-Regular, Consolas, monospace",
          fontSize: "0.78rem",
          margin: 0,
          overflowX: "auto",
          whiteSpace: "pre-wrap"
        }}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </Box>
  );
}
