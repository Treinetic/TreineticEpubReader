// Main Entry Point
import './css/main.css';
import { TreineticEpubReader } from './lib/TreineticEpubReader';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Modern Reader...");

    // Initialize UI Handlers
    const sidebar = document.getElementById('sidebar');

    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => {
        sidebar?.classList.toggle('visible'); // Check css if it uses .visible or transform
        // The original desktop.html uses .visible in css or inline styles? 
        // original desktop.js: $('#sidebar').toggleClass('visible');
        // original css: .desktop-sidebar.visible
    });

    document.getElementById('btn-close-sidebar')?.addEventListener('click', () => {
        sidebar?.classList.remove('visible');
    });

    // Theme Handlers
    document.querySelectorAll('.swatch').forEach(el => {
        el.addEventListener('click', (e) => {
            const theme = (e.target as HTMLElement).dataset.theme;
            if (theme) TreineticEpubReader.setTheme(theme);
        });
    });

    // Font Handlers
    let currentFontSize = 100;
    const updateFontDisplay = () => {
        const el = document.getElementById('font-val');
        if (el) el.innerText = `${currentFontSize}%`;
    };

    document.getElementById('btn-font-inc')?.addEventListener('click', () => {
        if (currentFontSize < 200) currentFontSize += 10;
        updateFontDisplay();
        TreineticEpubReader.setFontSize(currentFontSize);
    });

    document.getElementById('btn-font-dec')?.addEventListener('click', () => {
        if (currentFontSize > 50) currentFontSize -= 10;
        updateFontDisplay();
        TreineticEpubReader.setFontSize(currentFontSize);
    });

    // Navigation
    document.getElementById('btn-next')?.addEventListener('click', () => {
        TreineticEpubReader.nextPage();
    });

    document.getElementById('btn-prev')?.addEventListener('click', () => {
        TreineticEpubReader.prevPage();
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') TreineticEpubReader.prevPage();
        if (e.key === 'ArrowRight') TreineticEpubReader.nextPage();
    });

    let isScroll = false;

    const updateNavVisibility = () => {
        const btns = document.querySelectorAll('.nav-overlay-btn');
        btns.forEach(b => {
            if (isScroll) b.classList.remove('visible');
            else b.classList.add('visible');
        });
    };

    document.getElementById('btn-toggle-scroll')?.addEventListener('click', () => {
        isScroll = !isScroll;
        TreineticEpubReader.setScrollOption(isScroll ? 'scroll-continuous' : 'auto');
        updateNavVisibility();
        console.log("Scroll Mode:", isScroll);
    });

    // Initial state
    updateNavVisibility();

    // Initialize Reader
    const controls = TreineticEpubReader.init('#epub-reader-frame');
    if (controls) {
        controls.registerEvent("onTOCLoaded", (data: any) => {
            console.log("TOC Loaded", data);
            renderTOC(data);
        });

        controls.registerEvent("onEpubLoadSuccess", () => {
            console.log("EPUB Loaded Success");
            // Update Title
            const meta = controls.metadata;
            if (meta && meta.title) {
                const header = document.getElementById('book-title');
                if (header) {
                    header.innerText = meta.title;
                }
            }
        });
    }

    TreineticEpubReader.open('/modern/public/epubs/alice.epub'); // Correct path for root-served project
});

function renderTOC(data: any) {
    const list = document.getElementById('toc-list');
    if (!list) return;
    list.innerHTML = '';

    function build(items: any[]) {
        let html = '';
        items.forEach(i => {
            // Improved heuristic: Only treat as "Number -> Title" row if the parent is short or looks like a number.
            // This avoids collapsing "PART ONE ... " into a side-by-side view if it happens to have one child.
            // Heuristic Update:
            // 1. If it's a Number + Title (e.g. "1" -> "The ...") -> Render Inline (Number left, Title right)
            // 2. If it's a Text + Text (e.g. "PART TWO" -> "The Sea Cook") -> FLATTEN it. (Show Parent + Child on one line?)
            //    ACTUALLY, User said "taking them out". 
            //    If we just show the Child at the root level? "The Sea Cook"
            //    BUT we might lose "PART TWO".
            //    Let's try "Inline" for everything that has a single child, REGARDLESS of number.
            //    This creates "PART TWO   The Sea Cook" on one line.

            const cleanName = i.name.replace(/<[^>]*>?/gm, '').trim();
            // const isLikelyChapterNum = /^\d+\.?$/.test(cleanName); // REMOVED STRICT CHECK

            // If it has ONE child, we treat it as a "Header -> SubHeader" pair and flatten it into one inline row.
            const hasSingleChild = i.sub && i.sub.length === 1;

            if (hasSingleChild) {
                // Render inline: Parent (Bold/Gray) -> Child (Normal)
                const child = i.sub[0];
                html += `<li class="toc-item toc-item-row">
                            <a href="#" data-href="${i.Id_link}" class="toc-link toc-link-number" style="width:auto; min-width:30px;">
                               ${i.name}
                            </a>
                            <a href="#" data-href="${child.Id_link}" class="toc-link toc-link-title">
                               ${child.name}
                            </a>
                         </li>`;

                // We consume the child here.
            } else {
                html += `<li class="toc-item">
                            <a href="#" data-href="${i.Id_link}" class="toc-link">
                               ${i.name}
                            </a>`;
                if (i.sub && i.sub.length) {
                    html += '<ul class="toc-sub-list">' + build(i.sub) + '</ul>';
                }
                html += '</li>';
            }
        });
        return html;
    }

    list.innerHTML = build(data);

    // Bind click events
    list.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const href = (e.target as HTMLElement).closest('a')?.dataset.href;
            if (href) TreineticEpubReader.goToPage(href);
        });
    });
}
