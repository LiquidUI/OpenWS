<p><a href="https://liquid-ui.com/androiddoc" target="_blank"><img src="https://www.liquid-ui.com/images/liquid_logo_saperp_registered_3.png" alt="WS logo" style="max-width:100%;" height="70"></a></p> <h1>Liquid UI Android Client — Extensions Contributor Guide</h1>

> Target app: [Liquid UI for Android (Play Store)](https://play.google.com/store/apps/details?id=com.guixt.liquidui.android&hl=en_US)

This guide explains how to **create, configure, test, and submit** extensions that let the LUI Android client launch external app activities (via Android Intents) directly from the LUI UI.

---

## 1) What are “Extensions”?

Extensions are entries configured inside the LUI app that define:
- an external **package** (the target app),
- an **intent** (the activity/action to launch),
- optional **data exchange keys** for sending/receiving payloads,
- and basic **enable/disable** state and **category** (UI surface).

Invalid or unresolvable intents are visually highlighted in the LUI Extensions screen.

---

## 2) Pre‑requisites

- Android device with the latest **LUI** app installed from Play Store.
- The target app you wish to integrate must be installed and its activity must be **exported**/resolvable.
- Access to the **Extensions** screen (requires a password — see below).

---

## 3) Open the Extensions Screen (Insider / gated)

1. Launch **LUI**, open the **hamburger menu (☰)** → **App Settings**.  
2. **Long‑press** the *Version* field for ~5 seconds until a password prompt appears.  
3. Enter the password: `EXTENSIONS`.  
4. The **Extensions** dialog opens, showing the current list.

> Tip: Items with a red background indicate an intent that failed to resolve on this device (usually a bad package/activity).

---

## 4) Add an Extension (Form Mode)

1. In **Extensions**, tap **Add Extension**.  
2. Fill the fields:
   - **category** — use `popmenu` for new items (must be unique per existing category).
   - **label** — short display name shown in the tooltip.
   - **package** — the Android package of the target app (e.g., `com.android.chrome`).  
   - **intent** — the exported Activity *name or path* to launch (e.g., `MainActivity`).  
   - **value** — enable (checked = `true`) or disable (`false`) this entry.
3. Tap **Done**, then **Save**.

---

## 5) Add or Edit in **Advanced (JSON) Mode**

Use Advanced if you want full control or to bulk‑edit several entries via JSON.

1. In **Extensions**, tap **Advanced**.  
2. Edit the JSON document (all extensions).  
3. Tap **Save**. Unsaved changes will prompt a confirmation when leaving.

### 5.1 JSON Template

```json
{
  "category": "popmenu",
  "label": "My Action",
  "value": true,
  "package": "com.example.app",
  "intent": "MainActivity",
  "send-key": "metadata",
  "receive-key": "metadata",
  "receive-action": "0",
  "access": "control"
}
```

### 5.2 Field Reference

| Field | Type | Required | Default | Notes |
|---|---|---:|---:|---|
| `category` | string | ✔︎ | — | Must not duplicate existing categories. Use `popmenu` for new extensions. |
| `label` | string | ✔︎ | — | Shown in the tooltip when invoking. |
| `value` | boolean | ✔︎ | — | `true` = enabled, `false` = disabled. |
| `package` | string | ✔︎ | — | Target app package name. |
| `intent` | string | ✔︎ | — | Activity name/path to launch. |
| `access` | string | ✖︎ | `"control"` | Use `"connection"` only for the pre‑defined system list. |
| `send-key` | string | ✖︎ | `"metadata"` | Key used when **sending** data out to the external app. |
| `receive-key` | string | ✖︎ | `"metadata"` | Key for **receiving** data back from the external app. |
| `receive-action` | `"0" \| "1" \| "2"` | ✖︎ | `"0"` | Determines how the response is handled by LUI. |

> **Categories currently supported**: `popmenu` (for new items) plus predefined `ai`, `scan`, `ocr`, `ar`, `rfid`.  
> **Planned**: `cmenu` (context menu), `smenu` (system menu), `pb` (push button), `pbmenu` (push button menu).

---

## 6) Example: Launch Chrome’s Main Activity

```json
{
  "category": "popmenu",
  "label": "Open Chrome",
  "value": true,
  "package": "com.android.chrome",
  "intent": "MainActivity",
  "send-key": "queryTag",
  "receive-key": "responseTag",
  "receive-action": "0",
  "access": "control"
}
```

> Adjust `send-key` / `receive-key` according to the IPC your target app expects/returns.

---

## 7) Test Your Extension

1. After saving, navigate to **any transaction input field** inside LUI.  
2. **Long‑press** the field to open the tooltip.  
3. Your extension’s **label** should appear in the list.  
4. Tap it to launch your activity and verify the expected behavior and data flow.

Troubleshooting:
- If the item appears with a **red background** in the Extensions dialog, check `package` and `intent`.  
- Make sure the target activity is **exported** and the app is installed.

---

## 8) Remove an Extension

1. In **Extensions**, **long‑press** the list item you want to delete.  
2. Confirm **Yes** to remove.  

---

## 9) Data Exchange (IPC) Notes

- **Sending**: LUI sends data under the `send-key`. Your app should read extras accordingly.  
- **Receiving**: Return data to LUI using the same `receive-key`.  
- **receive-action** controls how LUI uses the response (`"0"`, `"1"`, `"2"` — choose based on desired UI behavior).

> For predictable UX, document your app’s required extras and returned payload shape in your PR.

---

## 10) Contributor Workflow (Recommended)

1. **Fork & branch** your docs or JSON snippet in this repository (or share via issue if repo‑less).  
2. Provide:  
   - A short **use‑case** description and demo notes.  
   - The **JSON** entry (or entries).  
   - **Test steps** and any target‑app requirements.  
3. Submit a **PR** for review. We will validate the JSON and perform device tests.

Version your extension docs with a `version:` note and keep a **changelog** of edits.

---

## 11) Security & Access

- The **password gate** protects the Extensions screen from casual edits. Do not publish the password in public repos.  
- Avoid declaring intents that escalate privileges or access sensitive user data. Follow the target app’s security guidelines.

---

## 12) FAQ

**Q: My extension doesn’t show in the tooltip.**  
A: Ensure it’s **enabled** (`value: true`), saved, and the **category** is supported (`popmenu`). Then long‑press an input field.

**Q: The row is red in the Extensions dialog.**  
A: The intent is not resolvable on this device—verify `package`/`intent`, and that the target app/activity is installed & exported.

**Q: Can I add my own categories?**  
A: Currently, contributors should use `popmenu`. Additional categories are planned; watch release notes.

---

## 13) Appendix: Quick Checklist

- [ ] Package installed & activity exported  
- [ ] JSON valid and category = `popmenu`  
- [ ] Label concise (≤ 20 chars recommended)  
- [ ] Enabled (`value: true`) and saved  
- [ ] Tested by long‑pressing a transaction input field, table cell or text box
- [ ] PR includes JSON, test steps, and target‑app notes

---

<h4>Disclaimer</h4>
<p>The content provided in this repository is for general educational purposes only. Synactive Inc does not warrant the accuracy or completeness of any information contained within this repository. It may be advisable for you to consult with a professional to get advice that applies to your specific implementation.</p>

<p>SAP and all SAP logos are trademarks or registered trademarks of SAP AG in Germany and in several other countries. All other product and service names mentioned are the trademarks of their respective companies.</p>

*Guide maintained by the Liquid UI team. Last updated: 2025-09-27.*