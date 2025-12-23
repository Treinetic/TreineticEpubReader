# Treinetic Modern EPUB Reader

A pure TypeScript, dependency-free, and high-performance EPUB reader for the web. This modernized version of the Treinetic Reader is designed to be lightweight, mobile-responsive, and easily extensible.

![Demo Preview](./modern/public/demo_preview.png)

## 🚀 Key Features

- **Zero Legacy Dependencies**: rewritten in TypeScript, removing jQuery and other legacy bloat.
- **Stacked View Scrolling**: seamless continuous vertical scrolling across chapters with dynamic loading (Infinite Scroll).
- **Advanced Pagination**: robust CSS multi-column pagination with support for single and widespread views.
- **Rich Theming**: built-in theme management (Day, Night, Sepia, Custom) with real-time injection.
- **Responsive Design**: fully responsive layout that adapts to mobile, tablet, and desktop viewports.
- **Overlay Navigation**: clean, non-intrusive navigation controls with keyboard support (Arrow keys).
- **Smart TOC**: automated Table of Contents generation that handles complex hierarchies and flattens unnecessary nesting.
- **Image & Cover Support**: correct rendering of full-page images, SVG wrappers, and cover pages.

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    This will launch the modern demo at `http://localhost:3000/modern/desktop.html`.

### Building for Production
To build the library and demo assets:
```bash
npm run build
```
The output will be generated in the `dist/` directory (or `modern/dist` depending on configuration).

## 📖 Usage Guide

### Basic Embedding
The modern reader is designed to be embedded in any HTML container.

```html
<!-- Container -->
<div id="reader-container" style="width: 100%; height: 600px;"></div>

<!-- Implementation -->
<script type="module">
    import { TreineticEpubReader } from './path/to/TreineticEpubReader.js';

    // Initialize
    const reader = new TreineticEpubReader('#reader-container');

    // Open Book
    reader.open('path/to/book.epub');
</script>
```

### Configuration Options
You can pass a configuration object to customize the reader's behavior (Implementation dependent on final API cleanup):

```typescript
const config = {
    scroll: 'paginated', // or 'scroll-continuous'
    theme: 'day',        // 'day', 'night', 'sepia'
    fontSize: 100,       // percentage
    fontFamily: 'sans-serif'
};
```

### API Methods
The `TreineticEpubReader` instance exposes a clean API for controlling the reader:

- `reader.nextPage()`: Go to the next page or scroll point.
- `reader.prevPage()`: Go to the previous page.
- `reader.goToChapter(href)`: Navigate to a specific chapter.
- `reader.setTheme(themeName)`: Apply a predefined theme.
- `reader.setScrollMode(mode)`: Toggle between 'paginated' and 'scroll-continuous'.

## 🏗 Architecture

The project is structured around a modular clean architecture:

- **`model/`**: Handles EPUB parsing, metadata extraction, spine management, and XML parsing.
    - `Package`: Represents the OPF package.
    - `Spine`: Manages the reading order.
    - `TOC`: Handles NCX/Nav parsing.
- **`view/`**: Manages the DOM, iframes, and rendering logic.
    - `ReaderView`: The core renderer. Manages iframe stacks for continuous scrolling or single frames for pagination.
- **`css/`**: Contains the core styles (`main.css`) for the UI and reader frame.

### Continuous Scroll Logic
The modern reader uses a **Stacked Iframe Architecture** for vertical scrolling:
1.  **Container Level Scroll**: The main container handles the scroll bar, not the iframe body.
2.  **Multi-Frame Stack**: As the user scrolls, new chapters are loaded into independent iframes appended to the stack.
3.  **Lazy Loading**: Simple heuristic detects when the viewport is near the bottom to fetch the next spine item.

## 📱 Mobile Support
The reader includes specific logic for touch interactions and responsive layouts. The demo includes a "Mobile Simulation" mode to test responsiveness on different device viewports (iPhone, Pixel).

## 📄 License
BSD-3-Clause
