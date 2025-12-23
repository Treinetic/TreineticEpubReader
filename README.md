# TreineticEpubReader (Modernized)

A modernized, simplified, and feature-rich version of the Treinetic Epub Reader. This version consolidates legacy dependencies into a single repository and provides a modern demo interface using Vite.

![Demo Preview](./dist/sample/assets/demo_preview.png)

## Key Features

- **Single Repository**: No more complex git submodules. Everything you need is included.
- **Modern Demo**: specific "Standard", "Themed", and "Mobile" views to showcase capabilities.
- **Rich UI**: Restored Sidebar with TOC, Toolbar with Font/Width/Theme controls.
- **Theming System**: Built-in support for Day, Night, Sepia, and **Custom** themes.
- **Mobile Responsive**: Optimized for generic mobile views (iPhone, Pixel simulation included).
- **Lightweight**: Refactored to remove dev-dependency bloat.

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run the Modern Demo**
    ```bash
    npm run dev
    ```
    This will start a Vite server at `http://localhost:3000`.

## Usage

### Basic Initialization
```html
<link rel="stylesheet" href="dist/TreineticEpubReader.min.css">
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="dist/TreineticEpubReader.min.js"></script>

<div id="reader-frame"></div>

<script>
    var config = TreineticEpubReader.config();
    config.jsLibRoot = "dist/workers/"; // Path to worker scripts

    TreineticEpubReader.create("#reader-frame");
    TreineticEpubReader.open("path/to/book.epub");
</script>
```

### Theming & Controls
You can control the reader programmatically:

```javascript
var controls = TreineticEpubReader.handler();

// Themes
controls.setTheme("night-theme"); 
controls.setTheme("default-theme");

// Layout
controls.changeFontSize(120); // %
controls.changeColumnMaxWidth(800);

// Navigation
controls.nextPage();
controls.prevPage();
controls.goToPage(href);
```

## Mobile Integration
For details on integrating this reader into iOS/Android apps, see [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md).

## Legacy Build
If you need to rebuild the core reader library from the `readium-js` source (now located in `readium-js/`), please refer to [LEGACY_BUILD.md](./LEGACY_BUILD.md).

## License
BSD-3-Clause
