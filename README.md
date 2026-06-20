# Production Warning Banner

A lightweight browser extension that displays a configurable warning banner on your production environments — so you never accidentally edit, delete, or submit something on prod when you meant to work on staging.

## What it does

When you visit a URL that matches your configured list, a colored banner is injected into the page. The banner:

- appears at the **top, bottom, left, or right** edge of the viewport
- is fully visible above page content (fixed positioning, highest z-index)
- can be **dismissed** with a close button — a small tab remains so you can bring it back
- is configurable: URL patterns, position, color, and text are all saved via browser sync storage
- works in **Single Page Apps** — the banner updates as you navigate between client-side routes, without a full page reload

## Configuration

Open the extension settings (click the toolbar icon → **Manage settings**):

| Setting | Description |
|---|---|
| **Production URLs** | One domain or URL per line. Supports `*` wildcards (e.g. `*.production.com`). |
| **Position** | Top, Bottom, Left, or Right edge of the page. |
| **Background Color** | Pick from presets (Red, Orange, Yellow, Green, Blue, Purple, Gray, Black) or use the color picker. |
| **Banner Text** | Custom label shown in the banner. Defaults to `⚠ PRODUCTION ENVIRONMENT ⚠`. |

### URL matching examples

```
example.com
*.production.com
https://app.mysite.com
admin.internal.io
```

## Browser compatibility

| Browser | Support |
|---|---|
| Firefox | ✅ (Manifest V2, WebExtensions API) |
| Chrome / Edge / Brave | ✅ (chrome.* API fallback) |

## Local development

No build step required — the extension is plain HTML, CSS, and JavaScript.

### Load in Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select any file inside this directory (e.g. `manifest.json`)

The extension is now active. Changes to source files take effect after clicking **Reload** on the debugging page.

### Load in Chrome / Edge

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select this directory

Changes to source files take effect after clicking the refresh icon on the extension card.

### Package for distribution

**Firefox (.zip for AMO):**

```bash
zip -r production-warning-banner.zip . \
  --exclude "*.git*" --exclude "README.md" --exclude "*.zip"
```

**Chrome (zip for Chrome Web Store):**

Same command — the Chrome Web Store also accepts a `.zip` of the unpacked extension directory.

## Project structure

```
ae-prod-warning/
├── manifest.json   # Extension manifest (MV2)
├── content.js      # Injected into every page — renders the banner
├── options.html    # Settings page UI
├── options.js      # Settings page logic
├── popup.html      # Toolbar popup
├── popup.js        # Opens the settings page
└── style.css       # (unused / reserved)
```

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Saves your URL list, position, color, and banner text via sync storage |

No network requests. No data collection. Settings stay in your browser.
