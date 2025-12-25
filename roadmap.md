# 🗺️ Project Roadmap

This roadmap outlines the strategic vision to establish **TreineticEpubReader** as the de facto open-source EPUB solution for the web.

## ✅ Phase 1: Foundation & Core Experience (Current)
*Focus: Rendering, Performance, and Visual Polish.*
- [x] **Core Engine**: Wrapper around `epub.js` with improved error handling.
- [x] **Responsive Layout**: "Split-View" desktop and native-feeling mobile/tablet layouts.
- [x] **Visual Customization**:
    - [x] Theming Engine (Day, Night, Authentic Kindle/Paper modes).
    - [x] API for custom reader themes (`registerTheme`).

## 📲 Phase 1.5: Mobile & UI Polish (Deferred Priority)
*Focus: Completing the "App-Like" feel.*
- [ ] **Mobile Interactions**:
    - Swipe-to-Turn gestures (TouchManager).
    - Hide/Show controls on tap.
    - Prevent viewport bouncing (overscroll-behavior).
- [ ] **UI Theme Engine**:
    - API to skin the *Application UI* (Sidebar, Toolbar) not just the book.
    - Presets: "Kindle Gray", "Apple Translucency".

## 🚀 Phase 2: Interaction & "Smart" Features (Next)
*Focus: Closing the gap with native readers (Apple Books, Moon+).*
- [ ] **Full-Text Search**: Index book content for instant results.
- [ ] **Selection & Annotations**:
    - Native-feeling text selection.
    - Highlighting (Colors) & Sticky Notes.
    - Persistence (Save/Load to JSON).
- [ ] **Lookup & Translation** (De-facto Feature):
    - Dictionary integration (Select word -> Definition).
    - Google/DeepL Translate integration for foreign books.

## 🎧 Phase 3: Accessibility & Performance
*Focus: Speed and Universality.*
- [ ] **Text-to-Speech (TTS)**: "Read Aloud" with word highlighting.
- [ ] **Virtualization**: Handle 1000+ page books without DOM lag (Render optimization).
- [ ] **Focus Mode**: Distraction-free interaction. summarization of chapters.
- **Contextual Dictionary**: AI-powered definitions and translations for selected text.
- **Natural Language Query**: "Ask the book" questions (e.g., "What is the relationship between character A and B?").

---

> *This roadmap is a living document and will evolve based on community feedback and market trends.*
