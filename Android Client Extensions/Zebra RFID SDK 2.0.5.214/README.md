<p><a href="https://liquid-ui.com/androiddoc" target="_blank"><img src="https://www.liquid-ui.com/images/liquid_logo_saperp_registered_3.png" alt="WS logo" style="max-width:100%;" height="70"></a></p> <h1>Liquid UI Android Extension — Zebra RFID (RFIDAPI3)</h1>

*How to build a small companion app from Zebra’s RFIDAPI3 SDK and wire it to Liquid UI (LUI) via Extensions.*

> Target host app: [Liquid UI for Android (Play Store)](https://play.google.com/store/apps/details?id=com.guixt.liquidui.android&hl=en_US)

> Integration style: **Android Intent** (launch external Activity from LUI tooltip)

> SDK used: **Zebra RFIDAPI3** (Android)

---

## 0) What you’ll build

A minimal Android app (based on Zebra’s RFIDAPI3 sample) with:

* An **exported Activity** you can launch from LUI.
* A simple **IPC contract** (extras in, extras out) using `send-key` / `receive-key` (`"metadata"` by default).
* A basic **UI color scheme** tweak so it’s easy to identify in demos.

You’ll then add an **Extension** entry inside LUI so users can long-press any input field and launch your Zebra RFID action.

---

## 1) Prerequisites

* **Android Studio** (Giraffe+ recommended) with latest SDK/Build-Tools.
* A test device (Android 9+) with **Liquid UI for Android** installed (from Play Store).
* Access to the LUI **Extensions** screen (password gate).
* Zebra **RFIDAPI3 SDK**: [the download link from Zebra](https://www.zebra.com/content/servlet/supportdownload/downloadManager?dlp=/content/dam/support-dam/en/application/unrestricted/0001/Zebra_RFIDAPI3_SDK_2.0.5.214.zip&c=us&l=en&pagePath=/content/zebra1/us/en/support-downloads/software/rfid-software/rfid-sdk-for-android).

> Tip: If you plan to use a physical RFID reader (e.g., RFD8500, RFD40), keep it nearby for live tests.

---

## 2) Get the SDK and Sample App

1. Download **Zebra RFIDAPI3** and unzip it locally.
2. In the extracted folder, locate the **Android sample** (often a Gradle project).
3. Open the project in **Android Studio**.

> If the project uses older Gradle/Plugin versions, let Android Studio **auto-migrate** when prompted.

---

<h4>Disclaimer</h4>
<p>The content provided in this repository is for general educational purposes only. Synactive Inc does not warrant the accuracy or completeness of any information contained within this repository. It may be advisable for you to consult with a professional to get advice that applies to your specific implementation.</p>

<p>SAP and all SAP logos are trademarks or registered trademarks of SAP AG in Germany and in several other countries. All other product and service names mentioned are the trademarks of their respective companies. Zebra® and the Zebra head logo are trademarks of Zebra Technologies Corp.</p>

*Guide maintained by the Liquid UI team. Last updated: 2025-09-27.*