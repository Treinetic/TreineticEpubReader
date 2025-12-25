// Demo Application Logic
// This script assumes 'TreineticEpubReader' is available globally (via UMD/IIFE build).

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Treinetic Reader Demo...");

    if (typeof TreineticEpubReader === 'undefined') {
        console.error("TreineticEpubReader library not found! Ensure the script is loaded.");
        return;
    }

    // Clear settings on reload for demo purposes
    TreineticEpubReader.clearSettings();

    // --- Event Listeners ---

    // Book Selector
    document.getElementById('book-selector').addEventListener('change', (e) => {
        const url = e.target.value;
        if (url) {
            console.log("Switching book to:", url);
            TreineticEpubReader.clearSettings();
            TreineticEpubReader.open(url);
        }
    });

    // Themes
    document.querySelectorAll('.swatch').forEach(el => {
        el.addEventListener('click', (e) => {
            const theme = e.target.dataset.theme;
            if (theme) TreineticEpubReader.setTheme(theme);
        });
    });

    // Font Size
    let currentFontSize = 100;
    const updateFontDisplay = () => {
        const el = document.getElementById('font-val');
        if (el) el.innerText = currentFontSize + '%';
    };

    document.getElementById('btn-font-inc').addEventListener('click', () => {
        if (currentFontSize < 200) currentFontSize += 10;
        updateFontDisplay();
        TreineticEpubReader.setFontSize(currentFontSize);
    });

    document.getElementById('btn-font-dec').addEventListener('click', () => {
        if (currentFontSize > 50) currentFontSize -= 10;
        updateFontDisplay();
        TreineticEpubReader.setFontSize(currentFontSize);
    });

    // Navigation
    document.getElementById('btn-next').addEventListener('click', () => TreineticEpubReader.nextPage());
    document.getElementById('btn-prev').addEventListener('click', () => TreineticEpubReader.prevPage());

    // Scroll Toggle
    let isScroll = false;
    document.getElementById('btn-toggle-scroll').addEventListener('click', () => {
        isScroll = !isScroll;
        TreineticEpubReader.setScrollOption(isScroll ? 'scroll-continuous' : 'auto');
        console.log("Scroll Mode:", isScroll);
    });

    // --- Initialization ---

    const controls = TreineticEpubReader.init('#epub-reader-frame');
    
    if (controls) {
        controls.registerEvent("onTOCLoaded", (data) => {
            console.log("TOC Loaded", data);
            renderTOC(data);
        });

        controls.registerEvent("onEpubLoadSuccess", () => {
            console.log("EPUB Loaded Success");
        });
    }

    // Set Defaults
    TreineticEpubReader.setTheme('default-theme');

    // Custom Theme Example
    TreineticEpubReader.registerTheme({
        name: 'custom-pink-theme',
        properties: {
            "background-color": "hotpink",
            "color": "yellow",
            "font-family": "Courier New"
        }
    });

    // Open Default Book
    TreineticEpubReader.open('/demo/public/epubs/alice.epub');
});


// Helper: Render Table of Contents
function renderTOC(data) {
    const list = document.getElementById('toc-list');
    if (!list) return;
    list.innerHTML = '';
    list.classList.add('custom-toc');

    function build(items) {
        let html = '';
        items.forEach(i => {
            const cleanName = i.name.replace(/<[^>]*>?/gm, '').trim();
            
            html += '<li class="toc-item">';
            html += '<a href="#" data-href="' + i.Id_link + '" class="toc-link" title="' + cleanName + '">';
            html += cleanName;
            html += '</a>';

            if (i.sub && i.sub.length) {
                html += '<ul class="toc-sub">' + build(i.sub) + '</ul>';
            }
            html += '</li>';
        });
        return html;
    }

    list.innerHTML = '<ul class="toc-root">' + build(data) + '</ul>';

    // Bind click events
    list.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.target.closest('a').dataset.href;
            if (href) TreineticEpubReader.goToPage(href);
        });
    });
}
