# 🗺️ Project Roadmap

This roadmap outlines the strategic vision to establish **TreineticEpubReader** as the de facto open-source EPUB solution for the web.

## 🚀 Phase 1: The Modern Foundation (Current Status)
**Goal:** Deliver a stable, high-performance, and lightweight reader with zero legacy dependencies.
- [x] **TypeScript Rewrite**: Fully typed codebase, removing jQuery/Underscore.
- [x] **Modern Architecture**: Clean separation of Parser, Model, and View layers.
- [x] **Stacked Scrolling**: Seamless vertical scrolling (Infinite Scroll) architecture.
- [x] **Advanced Pagination**: Robust CSS multi-column support.
- [x] **Rich Theming**: Built-in support for Day, Night, Sepia, and Custom themes.
- [x] **Mobile Responsiveness**: Adaptive layout for phone and tablet viewports.

---

## ⚡ Phase 2: Interaction & Accessibility (Next Sprint)
**Goal:** Transform the reader from a passive viewer into an interactive tool.
- [ ] **Advanced Annotation System**
    - Highlighting text (multiple colors).
    - Adding sticky notes/comments to highlights.
    - Export annotations to JSON/Markdown for personal knowledge management (Obsidian/Notion).
- [ ] **Full-Text Search**
    - Client-side indexing (e.g., FlexSearch) for instant search results across the entire book.
    - Context-aware result snippets.
- [ ] **Accessibility First (A11y)**
    - **Text-to-Speech (TTS)**: Integrated Web Speech API support with word-by-word highlighting (Read Aloud).
    - **Dyslexic Fonts**: Built-in support for OpenDyslexic.
    - **Screen Reader Optimization**: ARIA roles and semantic HTML structure.

---

## 🛠 Phase 3: Performance & Offline Capabilities
**Goal:** Ensure the reader works instantly, anywhere, even on slow networks.
- [ ] **Offline-First (PWA)**
    - Service Worker integration for caching app assets.
    - **IndexedDB Storage**: Save entire EPUB files locally for offline reading.
- [ ] **WebAssembly Parsing**
    - Move heavy XML/OPF parsing to a Rust-based WebAssembly module for near-instant load times on large libraries.
- [ ] **Hybrid Rendering**
    - Virtualized DOM for massive chapters to maintain 60fps scrolling performance.

---

## 🌐 Phase 4: Ecosystem & Expansion
**Goal:** Make the library universally compatible and easy to integrate.
- [ ] **Framework Wrappers**
    - Official `@treinetic/react-reader` component.
    - Official `@treinetic/vue-reader` component.
- [ ] **Cross-Device Sync**
    - "Cloud Hooks" API to allow developers to plug in their backend for syncing reading progress (CFI) and annotations.
- [ ] **Format Expansion**
    - PDF Support (via PDF.js integration) for a unified "Hybrid Reader".
    - CBR/CBZ Support for Comics/Manga.

---

## 🔮 Future Vision: "AI-Enhanced Reading"
- **Smart Summaries**: On-demand AI summarization of chapters.
- **Contextual Dictionary**: AI-powered definitions and translations for selected text.
- **Natural Language Query**: "Ask the book" questions (e.g., "What is the relationship between character A and B?").

---

> *This roadmap is a living document and will evolve based on community feedback and market trends.*
