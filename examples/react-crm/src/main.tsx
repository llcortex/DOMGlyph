import { ActionButton, DataTable, FormField, StatusBanner } from "@domglyph/components";
import { Box, Stack, Text } from "@domglyph/primitives";
import { CORTEX_UI_DEVTOOLS } from "@domglyph/runtime";
import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type CustomerRow = {
  id: string;
  company: string;
  owner: string;
  health: string;
};

const pipelineRows: readonly CustomerRow[] = [
  { id: "acct_101", company: "Northstar Labs", owner: "D. Kim", health: "Healthy" },
  { id: "acct_102", company: "Blueframe Inc.", owner: "S. Noor", health: "At Risk" },
  { id: "acct_103", company: "Fieldgrid", owner: "A. Chen", health: "Healthy" }
];

function ReactCRMDemo(): JSX.Element {
  const [email, setEmail] = useState("owner@northstar.dev");
  const [banner, setBanner] = useState<"success" | "error" | "info">("info");
  const [devtoolsOpen, setDevtoolsOpen] = useState(Boolean(CORTEX_UI_DEVTOOLS?.isVisible()));

  const summary = useMemo(
    () => ({
      actions: window.CORTEX_UI?.getAvailableActions().length ?? 0,
      entities: window.CORTEX_UI?.getVisibleEntities().length ?? 0
    }),
    [devtoolsOpen]
  );

  return (
    <Box
      data-ai-screen="crm-demo"
      style={{
        background: "linear-gradient(180deg, #f6fbff 0%, #edf5fb 100%)",
        color: "#10263d",
        minHeight: "100vh",
        padding: "32px"
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: "1180px" }}>
        <Stack gap="24px">
          <Box
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(16,38,61,0.1)",
              borderRadius: "28px",
              padding: "28px"
            }}
          >
            <Stack gap="16px">
              <Text as="p" style={{ color: "#2463a6", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                React CRM Demo
              </Text>
              <Text as="h1" style={{ fontSize: "2.8rem", fontWeight: 800, margin: 0 }}>
                Sales workspace
              </Text>
              <Text as="p" tone="muted">
                AI-friendly forms, actions, entity tables, and runtime inspection in a CRM layout.
              </Text>
              <Stack direction="row" gap="12px">
                <ActionButton
                  action={{ id: "toggle-crm-devtools", name: "Toggle CRM devtools" }}
                  aiState={devtoolsOpen ? "selected" : "idle"}
                  onClick={() => {
                    const next = window.CORTEX_UI_DEVTOOLS?.toggle() ?? false;
                    setDevtoolsOpen(next);
                  }}
                >
                  {devtoolsOpen ? "Hide Inspector" : "Show Inspector"}
                </ActionButton>
                <Text as="p" tone="muted">
                  Actions: {summary.actions} | Entities: {summary.entities}
                </Text>
              </Stack>
            </Stack>
          </Box>

          <StatusBanner aiId="crm-banner" status={banner} title="Account workflow">
            Update the owner email and submit an action to see contract metadata and runtime events.
          </StatusBanner>

          <div
            style={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))"
            }}
          >
            <Box
              data-ai-section="account-form"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(16,38,61,0.08)",
                borderRadius: "24px",
                padding: "24px"
              }}
            >
              <Stack as="form" data-ai-id="crm-account-form" data-ai-role="form" gap="18px">
                <Text as="h2" style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>
                  Account owner
                </Text>
                <FormField
                  fieldId="crm-owner-email"
                  fieldType="email"
                  hint="This form is discoverable through getFormSchema('crm-account-form')."
                  label="Owner email"
                  onChange={(event) => {
                    setEmail(event.currentTarget.value);
                    setBanner("info");
                  }}
                  required
                  successMessage={email.includes("@") ? "Looks deliverable." : undefined}
                  value={email}
                />
                <ActionButton
                  action={{
                    expectedOutcome: "Customer owner email updated",
                    id: "update-owner-email",
                    name: "Update owner email"
                  }}
                  aiState="idle"
                  onClick={() => {
                    setBanner(email.includes("@") ? "success" : "error");
                  }}
                >
                  Save Owner
                </ActionButton>
              </Stack>
            </Box>

            <Box
              data-ai-section="pipeline-table"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(16,38,61,0.08)",
                borderRadius: "24px",
                padding: "24px"
              }}
            >
              <DataTable
                aiId="crm-pipeline-table"
                caption="Open accounts currently tracked by the CRM team."
                columns={[
                  { header: "Company", key: "company" },
                  { header: "Owner", key: "owner" },
                  { header: "Health", key: "health" }
                ]}
                entity="crm-account"
                rows={pipelineRows}
              />
            </Box>
          </div>
        </Stack>
      </div>
    </Box>
  );
}

const mount = globalThis.document?.getElementById("root");
if (mount) {
  createRoot(mount).render(<ReactCRMDemo />);
}

export { ReactCRMDemo };
