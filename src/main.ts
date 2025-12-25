// Main Entry Point
import './css/main.css';
import './css/responsive.css';
import { TreineticEpubReader } from './lib/TreineticEpubReader';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Split-View Reader...");

    // User Request: Always start fresh on refresh for this demo
    TreineticEpubReader.clearSettings();

    // Book Selector Handler
    document.getElementById('book-selector')?.addEventListener('change', (e) => {
        const url = (e.target as HTMLSelectElement).value;
        if (url) {
            console.log("Switching book to:", url);
            TreineticEpubReader.clearSettings(); // Optional: reset state for new book
            TreineticEpubReader.open(url);
        }
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



    // Scroll Toggle
    let isScroll = false;
    document.getElementById('btn-toggle-scroll')?.addEventListener('click', () => {
        isScroll = !isScroll;
        TreineticEpubReader.setScrollOption(isScroll ? 'scroll-continuous' : 'auto');
        console.log("Scroll Mode:", isScroll);
    });

    // Initialize Reader
    const controls = TreineticEpubReader.init('#epub-reader-frame');
    if (controls) {
        controls.registerEvent("onTOCLoaded", (data: any) => {
            console.log("TOC Loaded", data);
            renderTOC(data);
        });

        controls.registerEvent("onEpubLoadSuccess", () => {
            console.log("EPUB Loaded Success");
        });
    }

    // Set Default Theme
    TreineticEpubReader.setTheme('default-theme');

    // Verification: Register a Custom Theme
    TreineticEpubReader.registerTheme({
        name: 'custom-pink-theme',
        properties: {
            "background-color": "hotpink",
            "color": "yellow",
            "font-family": "Courier New"
        }
    });

    TreineticEpubReader.open('/epubs/alice.epub');
});


function renderTOC(data: any) {
    const list = document.getElementById('toc-list');
    if (!list) return;
    list.innerHTML = '';
    list.classList.add('custom-toc'); // Hook for new CSS

    function build(items: any[]) {
        let html = '';
        items.forEach(i => {
            // Simple, clean recursive rendering
            const cleanName = i.name.replace(/<[^>]*>?/gm, '').trim();

            html += `<li class="toc-item">
                        <a href="#" data-href="${i.Id_link}" class="toc-link" title="${cleanName}">
                            ${cleanName}
                        </a>`;

            if (i.sub && i.sub.length) {
                // Recursive step for sub-chapters
                html += `<ul class="toc-sub">
                            ${build(i.sub)}
                         </ul>`;
            }
            html += '</li>';
        });
        return html;
    }

    list.innerHTML = `<ul class="toc-root">${build(data)}</ul>`;

    // Bind click events
    list.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const href = (e.target as HTMLElement).closest('a')?.dataset.href;
            if (href) TreineticEpubReader.goToPage(href);
        });
    });
}
