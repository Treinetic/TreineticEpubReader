# Mobile Integration Strategy

## Overview
The TreineticEpubReader is designed to be easily embedded into mobile applications (iOS/Android) using WebView technologies. This document outlines the strategy for seamless integration.

## 1. Integration Architecture

### Method A: WebView (Recommended)
Embed the reader as a local web application within a native container:
- **iOS**: `WKWebView`
- **Android**: `WebView` (with Chrome Client)
- **Frameworks**: Ionic, Capacitor, React Native (via `react-native-webview`)

### Method B: Server-Hosted
Host the reader on a CDN and load it remotely.
*   *Pros*: Instant updates without app store releases.
*   *Cons*: Requires internet connection; slower initial load.

## 2. Communication Bridge
To allow the native app to control the reader (e.g., native toolbar, saving progress), use a JavaScript Bridge.

### Sending Commands (Native -> Reader)
Inject JavaScript to control the reader instance:
```javascript
// Example: iOS injection
webView.evaluateJavaScript("TreineticEpubReader.handler().nextPage()")
```

### Receiving Events (Reader -> Native)
The reader exposes a callback mechanism.
```javascript
// In src/js/demo.js or a dedicated mobile-adapter.js
var controls = TreineticEpubReader.handler();
controls.registerEvent("onEpubLoadSuccess", function() {
    // Notify native app
    if (window.webkit && window.webkit.messageHandlers) {
         window.webkit.messageHandlers.onEpubLoadSuccess.postMessage("loaded");
    }
});
```

## 3. Responsive Design
The reader logic (`readium-js`) handles text reflow automatically.
- **Viewport**: The `meta viewport` tag is optimized for mobile: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- **Touch**: Gestures (swipe left/right) are enabled by default in the reader core.
- **UI adaptation**: The Sidebar and Toolbar provided in the demo are CSS-responsive. For native integrations, you may choose to **hide the HTML sidebar** and use native UI controls instead, sending commands to the reader via the Bridge.

## 4. Offline Capabilities
For a robust mobile experience, ensure all assets (HTML, JS, CSS, EPUB files) are bundled within the app or cached via a Service Worker.
- The `dist` folder contains everything needed for offline execution.
