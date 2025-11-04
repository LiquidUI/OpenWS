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

## 3) Rename the App & Package

The `namespace` / `applicationId` was changed and the package was moved to `com.zebra.rfid.demo.sdksample.lui.xt`.

So:

* In `app/build.gradle` update:

  ```gradle
  compileSdkVersion 36
  applicationId "com.zebra.rfid.demo.sdksample.lui.xt"
  minSdkVersion 28
  targetSdkVersion 35
  ```

* In `AndroidManifest.xml`, update `package="com.zebra.rfid.demo.sdksample.lui.xt"` rather than the downloaded `com.zebra.rfid.demo.sdksample`.

* Refactor all Java (or Kotlin) packages from `com.zebra.rfid.demo.sdksample` → `com.zebra.rfid.demo.sdksample.lui.xt` (this includes moving `MainActivity.java`, `RFIDHandler.java`, etc.).

---

## 4) Manifest & Activity updates

Key changes for LUI Extension to work:

* The `<activity>` entry shows both a custom action `com.guixt.EXTENSIONS_V2` and exported flag set.

* So in your `AndroidManifest.xml`, ensure your launch activity looks like:

  ```xml
  <activity android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="fullSensor">
      <intent-filter>
          <action android:name="com.guixt.EXTENSIONS_V2" />
          <category android:name="android.intent.category.DEFAULT" />
      </intent-filter>
      <!-- Note: The LAUNCHER intent-filter may still exist for debug/main entry -->
  </activity>
  ```

* Make sure you retain the **action name** exactly if you want LUI to launch via that action.

---

## 5) Implement IPC (data in/out)

In `MainActivity.java` a method `backToMainApp(View view)` which creates a `resultIntent` with `putExtra("metadata", …)` and does `setResult(Activity.RESULT_OK, resultIntent); finish();`
This corresponds exactly to using `"metadata"` as the `send-key` and `receive-key`. You can configure it to your desired specifications.

Thus:

* In your Activity, read extras with:

  ```java
  String req = getIntent().getStringExtra("metadata");
  ```

* On completion, return:

  ```java
  Intent resultIntent = new Intent();
  resultIntent.putExtra("metadata", payloadString);
  setResult(Activity.RESULT_OK, resultIntent);
  finish();
  ```

* Ensure that if you changed `receive-key` it must match what LUI expects; but since this sample uses `"metadata"`, you can keep that.

---

## 6) Color scheme & resources (non-functional changes)

You’ll see new colours defined such as `lui_white`, `lui_black`, `lui_gold`, `lui_blue`, etc. in `res/values/colors.xml` for personalization.

In `colors.xml`:

```xml
<color name="lui_white">#FFFFFF</color>
<color name="lui_black">#000000</color>
<color name="lui_gold">#FFFEC417</color>
<color name="lui_blue">#0078D7</color>
```

In `styles.xml`, reference these colours for your theme (so the extension UI ties into the Liquid UI branding/hook).

---

## 7) Build & install (with changes)

* Sync project (Gradle) after changes.
* Build using `./gradlew assembleDebug` or via Android Studio *Run*.
* Install on your test device.
* Ensure that the MainActivity (or whichever Activity you've designated) is recognized by the system and available for intent dispatch.

---

## 8) Wire into LUI (Extension JSON) using the new package/action

Given the new package `com.zebra.rfid.demo.sdksample.lui.xt` and the Intent `MainActivity`, you can choose to launch via action or class. The commit suggests using the action filter.

So in LUI Extensions JSON:

```json
{
  "category": "popmenu",
  "label": "RFID Scan (Zebra)",
  "value": true,
  "package": "com.zebra.rfid.demo.sdksample.lui.xt",
  "intent": "MainActivity",
  "send-key": "metadata",
  "receive-key": "metadata",
  "receive-action": "0",
  "access": "control"
}
```

* `package` must match `applicationId`.
* `intent` set to the activity name as per manifest.
* `send-key` and `receive-key` as per Activity implementation.
* `receive-action` remains `"0"` unless you have special behavior.

---

## 9) End-to-end test

1. In LUI, long-press on an input field → choose **RFID Scan (Zebra)**.
2. The extension launches your `MainActivity`.
3. The Activity performs scan, user taps **Back to Main App** (method `backToMainApp(View)`).
4. Activity returns result under extra `"metadata"` with payload.
5. LUI receives result and uses it appropriately.

Verify:

* The result appears in the input field or wherever LUI maps it.
* There is no red-background entry in Extensions list (meaning intent resolved fine).
* If the row is red, double-check package/action/exported settings.

---

## 10) Contributor checklist

* [ ] Package set to `com.zebra.rfid.demo.sdksample.lui.xt`.
* [ ] Intent‐filter action `MainActivity` present.
* [ ] `send-key`/`receive-key` set to `"metadata"`.
* [ ] JSON label kept concise, default `"value": true`.
* [ ] Build & test on actual hardware or emulator with reader stub.
* [ ] Changelog and version updated for your extension addition.

---

<h4>Disclaimer</h4>
<p>The content provided in this repository is for general educational purposes only. Synactive Inc does not warrant the accuracy or completeness of any information contained within this repository. It may be advisable for you to consult with a professional to get advice that applies to your specific implementation.</p>

<p>SAP and all SAP logos are trademarks or registered trademarks of SAP AG in Germany and in several other countries. All other product and service names mentioned are the trademarks of their respective companies. Zebra® and the Zebra head logo are trademarks of Zebra Technologies Corp.</p>

*Guide maintained by the Liquid UI team. Last updated: 2025-09-27.*