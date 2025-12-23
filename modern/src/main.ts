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

    TreineticEpubReader.open('/modern/public/epubs/epub_1.epub'); // Correct path for root-served project
});

function renderTOC(data: any) {
    const list = document.getElementById('toc-list');
    if (!list) return;
    list.innerHTML = '';

    function build(items: any[]) {
        let html = '';
        items.forEach(i => {
            html += `<li style="border-bottom:1px solid #eee;">
                        <a href="#" data-href="${i.Id_link}" 
                           style="display:block; padding:12px 15px; color:#333; text-decoration:none; font-size:14px;">
                           ${i.name}
                        </a>`;
            if (i.sub && i.sub.length) {
                html += '<ul style="list-style:none; padding-left:20px;">' + build(i.sub) + '</ul>';
            }
            html += '</li>';
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
