import { installDOMglyphDevtools, installDOMglyphRuntime } from "@domglyph/runtime";

const root = document.getElementById("root");

if (root) {
  root.innerHTML = `
    <div data-ai-screen="browser-agent-demo" style="min-height:100vh;padding:32px;background:linear-gradient(180deg,#f2f7f4 0%,#e8efeb 100%);font-family:Segoe UI,sans-serif;color:#12231b;">
      <div style="max-width:1180px;margin:0 auto;display:grid;gap:24px;">
        <section style="background:#fff;border:1px solid rgba(18,35,27,.1);border-radius:28px;padding:28px;">
          <p style="margin:0;color:#2f7c5f;letter-spacing:.18em;text-transform:uppercase;">Browser Agent Demo</p>
          <h1 style="margin:12px 0 8px;font-size:2.6rem;">Agent-readable workspace</h1>
          <p style="margin:0;color:rgba(18,35,27,.72);max-width:64ch;">This demo shows how an in-browser agent can inspect forms, actions, entities, and recent events through the DOMglyph runtime.</p>
        </section>

        <section data-ai-section="agent-actions" style="background:#fff;border:1px solid rgba(18,35,27,.1);border-radius:24px;padding:24px;display:grid;gap:16px;">
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button data-ai-id="agent-sync" data-ai-role="action" data-ai-action="sync-agent-queue" data-ai-state="idle" style="padding:12px 18px;border:none;border-radius:999px;background:#173b2c;color:#fff;font-weight:700;cursor:pointer;">Sync Queue</button>
            <button data-ai-id="agent-escalate" data-ai-role="action" data-ai-action="escalate-agent-case" data-ai-state="idle" style="padding:12px 18px;border:1px solid rgba(18,35,27,.14);border-radius:999px;background:#fff;color:#173b2c;font-weight:700;cursor:pointer;">Escalate Case</button>
            <button id="run-browser-agent" data-ai-id="run-browser-agent" data-ai-role="action" data-ai-action="run-browser-agent" data-ai-state="idle" style="padding:12px 18px;border:none;border-radius:999px;background:#2f7c5f;color:#fff;font-weight:700;cursor:pointer;">Run Agent Plan</button>
            <button id="toggle-agent-devtools" data-ai-id="toggle-agent-devtools" data-ai-role="action" data-ai-action="toggle-agent-devtools" data-ai-state="idle" style="padding:12px 18px;border:1px solid rgba(18,35,27,.14);border-radius:999px;background:#fff;color:#173b2c;font-weight:700;cursor:pointer;">Toggle Inspector</button>
          </div>
          <form data-ai-id="agent-search-form" data-ai-role="form" style="display:grid;gap:12px;">
            <label for="agent-query" style="font-weight:600;">Case search</label>
            <input id="agent-query" data-ai-id="agent-query" data-ai-role="field" data-ai-field-type="text" data-ai-required="true" data-ai-state="idle" type="text" value="Open escalation cases" style="border:1px solid rgba(18,35,27,.16);border-radius:14px;padding:12px 14px;font:inherit;" />
          </form>
        </section>

        <section data-ai-section="agent-table" style="background:#fff;border:1px solid rgba(18,35,27,.1);border-radius:24px;padding:24px;">
          <table data-ai-id="agent-case-table" data-ai-role="table" data-ai-entity="support-case" style="width:100%;border-collapse:collapse;">
            <caption style="text-align:left;margin-bottom:12px;font-weight:700;">Visible cases</caption>
            <thead>
              <tr>
                <th style="text-align:left;padding:12px;border-bottom:1px solid rgba(18,35,27,.12);">Case</th>
                <th style="text-align:left;padding:12px;border-bottom:1px solid rgba(18,35,27,.12);">Owner</th>
                <th style="text-align:left;padding:12px;border-bottom:1px solid rgba(18,35,27,.12);">Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr data-ai-id="case-row-1" data-ai-entity="support-case" data-ai-entity-id="case_1">
                <td style="padding:12px;border-bottom:1px solid rgba(18,35,27,.12);">case_1</td>
                <td style="padding:12px;border-bottom:1px solid rgba(18,35,27,.12);">Riya</td>
                <td style="padding:12px;border-bottom:1px solid rgba(18,35,27,.12);">High</td>
              </tr>
              <tr data-ai-id="case-row-2" data-ai-entity="support-case" data-ai-entity-id="case_2">
                <td style="padding:12px;">case_2</td>
                <td style="padding:12px;">Luis</td>
                <td style="padding:12px;">Normal</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style="background:#0f2119;color:#effaf4;border-radius:24px;padding:24px;">
          <h2 style="margin-top:0;">Agent runtime output</h2>
          <pre id="agent-output" style="white-space:pre-wrap;font:12px/1.5 SFMono-Regular,Consolas,monospace;margin:0;"></pre>
        </section>
      </div>
    </div>
  `;
}

const runtime = installDOMglyphRuntime(window);
installDOMglyphDevtools(window);

const output = document.getElementById("agent-output");

function renderAgentView(): void {
  if (!runtime || !output) {
    return;
  }

  output.textContent = JSON.stringify(
    {
      actions: runtime.getAvailableActions(),
      entities: runtime.getVisibleEntities(),
      recentEvents: runtime.getRecentEvents(),
      screen: runtime.getScreenContext()
    },
    null,
    2
  );
}

document.getElementById("toggle-agent-devtools")?.addEventListener("click", () => {
  window.CORTEX_UI_DEVTOOLS?.toggle();
});

document.getElementById("run-browser-agent")?.addEventListener("click", () => {
  const nextAction = runtime?.getAvailableActions()[0];
  const screen = runtime?.getScreenContext();
  if (output) {
    output.textContent = JSON.stringify(
      {
        decision: "Inspect visible actions and prioritize the first available action.",
        nextAction,
        screen
      },
      null,
      2
    );
  }
});

renderAgentView();
window.setInterval(renderAgentView, 1000);
