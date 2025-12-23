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

    let isScroll = false;
    document.getElementById('btn-toggle-scroll')?.addEventListener('click', () => {
        isScroll = !isScroll;
        TreineticEpubReader.setScrollOption(isScroll ? 'scroll-continuous' : 'auto');

        const navbar = document.querySelector('.bottom-nav-bar') as HTMLElement;
        if (navbar) navbar.style.display = isScroll ? 'none' : 'flex';

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
            const hasSingleChild = i.sub && i.sub.length === 1;

            if (hasSingleChild) {
                // Special handling for Number -> Title hierarchy: Render inline
                const child = i.sub[0];
                html += `<li style="border-bottom:1px solid #eee; display: flex; flex-direction: row; align-items: baseline;">
                            <a href="#" data-href="${i.Id_link}" 
                               style="display:inline-block; padding:12px 5px 12px 15px; color:#333; text-decoration:none; font-size:14px; font-weight:bold;">
                               ${i.name}
                            </a>
                            <a href="#" data-href="${child.Id_link}" 
                               style="display:inline-block; padding:12px 15px 12px 0px; color:#333; text-decoration:none; font-size:14px; flex: 1;">
                               ${child.name}
                            </a>
                         </li>`;
                // Note: We don't recurse further on the child because we consumed it effectively.
                // If the child had ITS OWN children (grand-children), we might be hiding them.
                // Assuming depth is shallow for this pattern. 
                // To be safe, if child has subs, we should append them?
                if (child.sub && child.sub.length > 0) {
                    html += '<ul style="list-style:none; padding-left:20px;">' + build(child.sub) + '</ul>';
                }
            } else {
                html += `<li style="border-bottom:1px solid #eee;">
                            <a href="#" data-href="${i.Id_link}" 
                               style="display:block; padding:12px 15px; color:#333; text-decoration:none; font-size:14px;">
                               ${i.name}
                            </a>`;
                if (i.sub && i.sub.length) {
                    html += '<ul style="list-style:none; padding-left:20px;">' + build(i.sub) + '</ul>';
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
