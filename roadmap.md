# 🗺️ Project Roadmap

This roadmap outlines our strategic vision: **To establish TreineticEpubReader as the de facto open-source engine for EPUB manipulation and rendering on the web.**

We aim to replace legacy, heavy readers with a modern, modular, and high-performance TypeScript solution that powers the next generation of reading apps.

## ✅ Phase 1: Foundation & Core Experience (Current)
*Goal: A modern, stable, and drop-in replacement for legacy readers.*
- [x] **Core Architecture**: Rewritten in TypeScript with zero heavy dependencies.
- [x] **Responsive Layout**: "Split-View" desktop and native-feeling mobile/tablet layouts (Internal Wrapper Pattern).
- [x] **Visual Customization**:
    - [x] Theming Engine (Day, Night, Authentic Kindle/Paper modes).
    - [x] API for custom reader themes (`registerTheme`).

## 📲 Phase 2: App-Like Experience
*Goal: Closing the gap between web readers and native apps (Kindle/Apple Books).*
- [ ] **Mobile Interaction Polish**:
    - Swipe-to-Turn gestures with physics.
    - Smart "immersive mode" (hide controls on tap).
- [ ] **Rich UI Components**:
    - Provide optional, skinnable UI kits (Sidebars, Settings Modals) for developers who want a "complete app" out of the box.

## 🚀 Phase 3: "Smart" Features & Research
*Goal: Features that static PDF/EPUB readers can't duplicate.*
- [ ] **Full-Text Search**: High-performance client-side indexing.
- [ ] **Data Persistence**:
    - Standardized format for Highlights, Bookmarks, and Reading Progress.
    - Sync adapters for backend databases.
- [ ] **Lookup & Translation**: 
    - Contextual dictionary and translation integrations (Google/DeepL).

## ⚡ Phase 4: Performance & Accessibility
*Goal: Handling libraries of thousands of books and thousands of pages.*
- [ ] **Virtualization Engine**: Render huge chapters without DOM lag.
- [ ] **Accessibility First**: Full Screen Reader support (ARIA), Text-to-Speech (TTS) integration.
- [ ] **Offline-First**: Service Worker strategies for reading without internet.

---
> *This roadmap is a living document. We welcome community contributions to help us build the future of reading on the web.*
