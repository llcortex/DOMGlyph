"use client";

import { ActionButton, DataTable, FormField, StatusBanner } from "@domglyph/components";
import { Box, Stack, Text } from "@domglyph/primitives";
import { installDOMglyphDevtools } from "@domglyph/runtime";
import { useState } from "react";

const incidents = [
  { id: "inc_1", latency: "138ms", region: "us-east-1", status: "Healthy" },
  { id: "inc_2", latency: "244ms", region: "eu-west-1", status: "Investigating" }
] as const;

export default function DashboardExamplePage(): JSX.Element {
  const [threshold, setThreshold] = useState("250");
  const [status, setStatus] = useState<"success" | "error" | "info">("info");

  return (
    <Box data-ai-screen="ops-dashboard" style={{ minHeight: "100vh", padding: "32px" }}>
      <div style={{ margin: "0 auto", maxWidth: "1200px" }}>
        <Stack gap="24px">
          <Box style={{ background: "#fff", border: "1px solid rgba(19,35,59,0.08)", borderRadius: "28px", padding: "28px" }}>
            <Stack gap="14px">
              <Text as="p" style={{ color: "#2f5fd8", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                Next.js Dashboard
              </Text>
              <Text as="h1" style={{ fontSize: "2.7rem", fontWeight: 800, margin: 0 }}>
                Operations console
              </Text>
              <Text as="p" tone="muted">
                A dashboard example with AI-friendly controls, runtime metadata, and a toggleable inspector overlay.
              </Text>
              <ActionButton
                action={{ id: "toggle-dashboard-devtools", name: "Toggle dashboard devtools" }}
                aiState="idle"
                onClick={() => {
                  installDOMglyphDevtools(window)?.toggle();
                }}
              >
                Toggle Inspector
              </ActionButton>
            </Stack>
          </Box>

          <StatusBanner aiId="dashboard-status" status={status} title="Service posture">
            Review alert thresholds, trigger dashboard actions, and inspect the visible runtime state.
          </StatusBanner>

          <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <Box data-ai-section="threshold-form" style={{ background: "#fff", border: "1px solid rgba(19,35,59,0.08)", borderRadius: "24px", padding: "24px" }}>
              <Stack as="form" data-ai-id="dashboard-threshold-form" data-ai-role="form" gap="16px">
                <Text as="h2" style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0 }}>
                  Alert threshold
                </Text>
                <FormField
                  fieldId="latency-threshold"
                  fieldType="number"
                  hint="Exposed through getFormSchema('dashboard-threshold-form')."
                  label="Latency threshold (ms)"
                  onChange={(event) => {
                    setThreshold(event.currentTarget.value);
                    setStatus("info");
                  }}
                  required
                  value={threshold}
                />
                <ActionButton
                  action={{ id: "save-dashboard-threshold", name: "Save threshold" }}
                  aiState="idle"
                  onClick={() => setStatus(Number(threshold) < 200 ? "success" : "info")}
                >
                  Save Threshold
                </ActionButton>
              </Stack>
            </Box>

            <Box data-ai-section="incident-table" style={{ background: "#fff", border: "1px solid rgba(19,35,59,0.08)", borderRadius: "24px", padding: "24px" }}>
              <DataTable
                aiId="dashboard-incident-table"
                caption="Service regions visible in the dashboard."
                columns={[
                  { header: "Region", key: "region" },
                  { header: "Latency", key: "latency" },
                  { header: "Status", key: "status" }
                ]}
                entity="service-region"
                rows={incidents}
              />
            </Box>
          </div>
        </Stack>
      </div>
    </Box>
  );
}
