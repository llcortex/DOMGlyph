import { installDOMglyphDevtools, installDOMglyphRuntime } from "@domglyph/runtime";

const root = document.getElementById("root");

if (root) {
  root.innerHTML = `
    <div data-ai-screen="vanilla-demo" style="min-height:100vh;padding:32px;background:linear-gradient(180deg,#fff9ef 0%,#f5ecdd 100%);font-family:Segoe UI,sans-serif;color:#27190d;">
      <div style="max-width:1100px;margin:0 auto;display:grid;gap:24px;">
        <section style="background:#fff;border:1px solid rgba(39,25,13,.12);border-radius:24px;padding:24px;">
          <p style="margin:0;color:#b86b1f;letter-spacing:.18em;text-transform:uppercase;">Vanilla Demo</p>
          <h1 style="margin:12px 0 8px;font-size:2.6rem;">Plain browser integration</h1>
          <p style="margin:0;color:rgba(39,25,13,.72);max-width:64ch;">This example uses raw HTML and the runtime/devtools directly, with no React dependency.</p>
        </section>

        <section data-ai-section="vanilla-form" style="background:#fff;border:1px solid rgba(39,25,13,.12);border-radius:24px;padding:24px;">
          <form data-ai-id="vanilla-profile-form" data-ai-role="form" style="display:grid;gap:16px;">
            <label for="vanilla-email" style="font-weight:600;">Notification Email</label>
            <input
              id="vanilla-email"
              data-ai-id="vanilla-email"
              data-ai-role="field"
              data-ai-field-type="email"
              data-ai-required="true"
              data-ai-state="idle"
              type="email"
              value="ops@domglyph.dev"
              style="border:1px solid rgba(39,25,13,.18);border-radius:14px;padding:12px 14px;font:inherit;"
            />
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <button
                data-ai-id="vanilla-save"
                data-ai-role="action"
                data-ai-action="save-vanilla-form"
                data-ai-state="idle"
                type="button"
                style="padding:12px 18px;border-radius:999px;border:none;background:#27190d;color:#fff;font-weight:700;cursor:pointer;"
              >
                Save Settings
              </button>
              <button
                id="toggle-vanilla-inspector"
                data-ai-id="vanilla-toggle-inspector"
                data-ai-role="action"
                data-ai-action="toggle-vanilla-inspector"
                data-ai-state="idle"
                type="button"
                style="padding:12px 18px;border-radius:999px;border:1px solid rgba(39,25,13,.18);background:#fff;color:#27190d;font-weight:700;cursor:pointer;"
              >
                Toggle Inspector
              </button>
            </div>
          </form>
        </section>

        <section data-ai-section="vanilla-table" style="background:#fff;border:1px solid rgba(39,25,13,.12);border-radius:24px;padding:24px;">
          <table data-ai-id="vanilla-entity-table" data-ai-role="table" data-ai-entity="browser-record" style="width:100%;border-collapse:collapse;">
            <caption style="text-align:left;margin-bottom:12px;font-weight:700;">Queued browser records</caption>
            <thead>
              <tr>
                <th style="text-align:left;padding:12px;border-bottom:1px solid rgba(39,25,13,.12);">ID</th>
                <th style="text-align:left;padding:12px;border-bottom:1px solid rgba(39,25,13,.12);">Type</th>
                <th style="text-align:left;padding:12px;border-bottom:1px solid rgba(39,25,13,.12);">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr data-ai-id="browser-record-row-1" data-ai-entity="browser-record" data-ai-entity-id="rec_1">
                <td style="padding:12px;border-bottom:1px solid rgba(39,25,13,.12);">rec_1</td>
                <td style="padding:12px;border-bottom:1px solid rgba(39,25,13,.12);">Lead</td>
                <td style="padding:12px;border-bottom:1px solid rgba(39,25,13,.12);">Queued</td>
              </tr>
              <tr data-ai-id="browser-record-row-2" data-ai-entity="browser-record" data-ai-entity-id="rec_2">
                <td style="padding:12px;">rec_2</td>
                <td style="padding:12px;">Ticket</td>
                <td style="padding:12px;">Open</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  `;
}

installDOMglyphRuntime(window);
installDOMglyphDevtools(window);

document.getElementById("toggle-vanilla-inspector")?.addEventListener("click", () => {
  window.CORTEX_UI_DEVTOOLS?.toggle();
});
