// ReaderView.ts
import { Package } from '../model/Package';
import { SpineItem } from '../model/SpineItem';

export class ReaderView {
    container: HTMLElement;
    epubPackage?: Package;
    iframe?: HTMLIFrameElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.container.addEventListener('scroll', this.onContainerScroll.bind(this));
    }

    openBook(epubPackage: Package) {
        this.epubPackage = epubPackage;
        // Start by opening the first LINEAR item
        const firstItem = epubPackage.spine.firstLinear();
        if (firstItem) this.openSpineItem(firstItem);
    }

    // ... (rest of method)

    async openPageRight() {
        if (this.currentPageIndex < this.pageCount - 1) {
            this.currentPageIndex++;
            this.scrollToPage(this.currentPageIndex);
        } else {
            // Next Chapter
            if (!this.epubPackage || !this.currentItem) return;
            const next = this.epubPackage.spine.nextLinear(this.currentItem);
            if (next) {
                this.currentPageIndex = 0; // Reset for new chap
                await this.openSpineItem(next);
            }
        }
    }

    async openPageLeft() {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
            this.scrollToPage(this.currentPageIndex);
        } else {
            // Previous Chapter
            if (!this.epubPackage || !this.currentItem) return;
            const prev = this.epubPackage.spine.prevLinear(this.currentItem);
            if (prev) {
                // We should ideally go to the LAST page of the prev chapter.
                this.currentPageIndex = -1; // Marker
                await this.openSpineItem(prev);
            }
        }
    }

    async openSpineItem(item: SpineItem, append: boolean = false) {
        // 1. Manage Frames
        if (!append) {
            // Clear existing frames
            this.container.innerHTML = '';
            this.frames = [];
            this.iframe = undefined;
        }

        // Create new Iframe
        const iframe = document.createElement('iframe');
        iframe.style.width = "100%";
        iframe.style.border = "none";

        // Initial stlyes based on mode
        if (this.currentSettings.scroll === 'scroll-continuous') {
            iframe.style.height = "100vh"; // Temp until loaded
            iframe.scrolling = "no";
            this.container.style.overflowY = "auto";
        } else {
            iframe.style.height = "100%";
            this.container.style.overflowY = "hidden";
        }

        this.container.appendChild(iframe);
        this.frames.push({ item, element: iframe });

        // Keep reference to "main" iframe for paginated logic
        if (!append) this.iframe = iframe;

        // 2. Load Content
        if (this.epubPackage) {
            let content: string | null = null;

            // Handle Image Spine Items (Cover or full page images)
            if (item.media_type && item.media_type.startsWith('image/')) {
                const blob = await this.epubPackage.loadBlob(item.href);
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    content = `<!DOCTYPE html>
                    <html style="height:100%"><head>
                        <title>Image Content</title>
                        <style>
                            body { margin:0; padding:0; height:100%; display:flex; 
                                   align-items:center; justify-content:center; }
                            img { max-height:100%; max-width:100%; object-fit:contain; }
                        </style>
                    </head><body>
                        <img src="${url}">
                    </body></html>`;
                }
            } else {
                // Text/HTML Content
                content = await this.epubPackage.loadFile(item.href);
                // 2.b Process content for resources if zipped
                if (content && this.epubPackage.zip) {
                    content = await this.injectResources(content, item.href);
                }
            }

            if (content) {
                iframe.srcdoc = content;
                iframe.onload = () => {
                    this.initFrameContent(iframe);
                };

                console.log(`Loading spine item: ${item.href}`);
                if (!append) this.currentItem = item;
            } else {
                console.error("Failed to load content for", item.href);
            }
        }
    }

    private onContainerScroll() {
        if (this.currentSettings.scroll !== 'scroll-continuous') return;
        if (this.isLoadingNext) return;

        const { scrollTop, scrollHeight, clientHeight } = this.container;
        // Threshold to load next (e.g. 500px before end)
        if (scrollTop + clientHeight > scrollHeight - 500) {
            this.loadNextChapter();
        }
    }

    private async loadNextChapter() {
        if (!this.epubPackage || !this.frames.length) return;

        const lastFrame = this.frames[this.frames.length - 1];
        const nextItem = this.epubPackage.spine.nextLinear(lastFrame.item);

        if (nextItem) {
            console.log("Auto-loading next chapter:", nextItem.href);
            this.isLoadingNext = true;
            await this.openSpineItem(nextItem, true);
            this.isLoadingNext = false;
        }
    }

    // Pagination & Style State
    private columnGap = 40;
    private currentPageIndex = 0;
    private pageCount = 0;
    private currentSettings: any = {};

    // Frame Management
    private frames: { item: SpineItem, element: HTMLIFrameElement }[] = [];
    private isLoadingNext = false;

    private initFrameContent(iframe: HTMLIFrameElement) {
        if (!iframe || !iframe.contentDocument) return;

        // console.log("initFrameContent: applying settings and pagination");
        const doc = iframe.contentDocument;
        const html = doc.documentElement;
        const body = doc.body;

        // INTERCEPT CLICKS
        body.addEventListener('click', (e) => {
            let target = e.target as HTMLElement;
            while (target && target !== body && target.tagName !== 'A') {
                target = target.parentElement as HTMLElement;
            }
            if (target && target.tagName === 'A') {
                const href = target.getAttribute('href');
                if (href) {
                    e.preventDefault();
                    this.handleLinkClick(href);
                }
            }
        });

        // Apply Styles
        this.applySettingsToDoc(doc, iframe);

        // Setup Pagination (CSS Columns) or Content Height
        this.updatePagination(iframe);

        // Listen for Resize
        window.addEventListener('resize', () => {
            this.updatePagination(iframe);
        });

        // Scroll Mode: Resize iframe to fit content
        if (this.currentSettings.scroll === 'scroll-continuous') {
            const updateHeight = () => {
                if (iframe.contentDocument) {
                    const newHeight = iframe.contentDocument.documentElement.scrollHeight;
                    iframe.style.height = `${newHeight}px`;
                }
            };
            // Initial sizing
            setTimeout(updateHeight, 100);

            // Observe changes
            const observer = new ResizeObserver(updateHeight);
            observer.observe(body);
            // Also listen to images load?
            iframe.contentWindow?.addEventListener('load', updateHeight);
        }

        // Handle case where we came from previous chapter and need to go to last page
        // Only for paginated mode
        if (this.currentSettings.scroll !== 'scroll-continuous' && this.currentPageIndex < 0) {
            this.currentPageIndex = this.pageCount - 1;
            this.scrollToPage(this.currentPageIndex);
        }
    }

    public updateSettings(settings: any) {
        this.currentSettings = { ...this.currentSettings, ...settings };

        // Apply to ALL active frames
        this.frames.forEach(f => {
            if (f.element.contentDocument) {
                this.applySettingsToDoc(f.element.contentDocument, f.element);
                this.updatePagination(f.element);
            }
        });

        // Handle scroll mode container style update
        if (this.currentSettings.scroll === 'scroll-continuous') {
            this.container.style.overflowY = "auto";
        } else {
            this.container.style.overflowY = "hidden";
        }
    }

    public setBookStyles(styles: any[]) {
        this.frames.forEach(f => {
            const iframe = f.element;
            if (!iframe || !iframe.contentDocument) return;
            const doc = iframe.contentDocument;

            // Remove old theme styles
            const oldStyle = doc.getElementById('readium-theme-style');
            if (oldStyle) oldStyle.remove();

            const styleEl = doc.createElement('style');
            styleEl.id = 'readium-theme-style';

            let css = '';
            styles.forEach(s => {
                let decls = '';
                for (const [prop, val] of Object.entries(s.declarations)) {
                    // Convert camelCase to kebab-case
                    const kebabWrapper = prop.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                    decls += `${kebabWrapper}: ${val} !important; `;
                }
                css += `${s.selector} { ${decls} } \n`;
            });

            // FIX: Inject structural styles for decent pagination and scroll
            css += `
                 img { max-width: 100%; box-sizing: border-box; break-inside: avoid; page-break-inside: avoid; }
                 p, h1, h2, h3, h4, h5, h6 { break-inside: avoid; page-break-inside: avoid; }
             `;

            styleEl.textContent = css;
            doc.head.appendChild(styleEl);
        });
    }

    private applySettingsToDoc(doc: Document, iframe: HTMLIFrameElement) {
        const html = doc.documentElement;
        const body = doc.body;

        // Font Size
        if (this.currentSettings.fontSize) {
            html.style.fontSize = `${this.currentSettings.fontSize}%`;
        }

        // Column Layout
        const width = this.iframe!.clientWidth;
        const height = this.iframe!.clientHeight;

        // Legacy Reflowable Logic mimic
        const isScroll = this.currentSettings.scroll === 'scroll-continuous';

        if (isScroll) {
            // Vertical Scroll Mode
            html.style.height = 'auto'; // let it grow
            html.style.width = '100vw'; // full width usually
            html.style.overflowY = 'auto';
            html.style.overflowX = 'hidden';

            // Ensure body allows scrolling
            body.style.height = 'auto';
            body.style.overflowY = 'visible';

            html.style.columnWidth = 'auto';
            html.style.columnGap = '0';

            // Reset positioning
            html.style.position = 'static';
            html.style.left = '0';
            iframe.style.overflow = 'hidden'; // Hide scrollbars on iframe, container handles it
        } else {
            // Paginated Mode (CSS Columns)
            html.style.height = `${height}px`;
            html.style.width = '100%'; // Not 100vw, but 100% of iframe

            // Important: Position relative to allow shifting
            html.style.position = 'relative';
            html.style.margin = '0';
            html.style.padding = '0';
            html.style.top = '0';
            html.style.left = '0'; // Start at 0

            // Create Columns
            // Check for Double Page Spread
            const isLandscape = width > height;
            const spreadSetting = this.currentSettings.syntheticSpread;
            let forceDouble = spreadSetting === 'double';
            if (!spreadSetting || spreadSetting === 'auto') {
                forceDouble = isLandscape && width > 800; // Heuristic: Landscape and wide enough
            }

            if (forceDouble) {
                const colWidth = (width - this.columnGap) / 2;
                html.style.columnWidth = `${colWidth}px`;
            } else {
                html.style.columnWidth = `${width - this.columnGap}px`;
            }

            html.style.columnGap = `${this.columnGap}px`;
            html.style.columnFill = 'auto';

            // Ensure body doesn't mess it up
            body.style.margin = '0';
            body.style.padding = '0';

            // Hide scrollbars on the IFRAME itself
            if (iframe) iframe.style.overflow = 'hidden';
        }
    }

    private handleLinkClick(href: string) {
        console.log("Internal link clicked:", href);
        // If external (http), let it open in new tab?
        if (href.startsWith('http')) {
            window.open(href, '_blank');
            return;
        }

        // If relative, resolve against current item
        if (this.currentItem) {
            // Check if it's just an anchor on same page
            if (href.startsWith('#')) {
                this.scrollToAnchor(href.substring(1));
                return;
            }

            // Complex relative URL resolution
            // href: "../Text/chap01.xhtml"
            // current: "OEBPS/Text/intro.xhtml"
            // This needs a proper resolver. 
            // Ideally we just pass it to openContentUrl which should handle finding the spine item.
            // But we need to make sure openContentUrl can handle relative paths if provided?
            // Actually openContentUrl logic:
            // const item = this.epubPackage.spine.getItemByHref(path);
            // getItemByHref expects specific path.

            // Let's rely on resolvePath util to get absolute path from root
            const absolutePath = this.resolvePath(this.currentItem.href, href);
            console.log("Resolved link path:", absolutePath);

            this.openContentUrl(absolutePath);
        }
    }

    private updatePagination(iframe: HTMLIFrameElement) {
        if (!iframe || !iframe.contentDocument) return;

        // Skip pagination logic if in scroll mode
        if (this.currentSettings.scroll === 'scroll-continuous') return;

        console.log("updatePagination executing...");

        const html = iframe.contentDocument.documentElement;

        // Measure exact column width (might slightly differ from calc)
        // Legacy assumes fixed width columns based on viewport
        const viewWidth = iframe.clientWidth;

        // Total width of the paginated content
        const fullWidth = html.scrollWidth;

        this.pageCount = Math.ceil(fullWidth / (viewWidth + this.columnGap));

        if (this.pageCount === 0) this.pageCount = 1;

        console.log(`Pagination: ${fullWidth} / ${viewWidth} = ${this.pageCount} pages`);

        // Clamp
        if (this.currentPageIndex >= this.pageCount) this.currentPageIndex = this.pageCount - 1;
        if (this.currentPageIndex < 0) this.currentPageIndex = 0;

        this.scrollToPage(this.currentPageIndex);
    }

    private scrollToPage(index: number) {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const html = this.iframe.contentDocument.documentElement;
        const viewWidth = this.iframe.clientWidth;

        // Calculate offset
        // We shift the HTML element to the left
        // offset = index * (width + gap)
        const offset = index * (viewWidth + this.columnGap);

        console.log(`scrollToPage: index=${index}, offset=${offset}`);

        // Use 'left' as legacy did
        html.style.left = `-${offset}px`;
    }

    currentItem?: SpineItem;


    async openContentUrl(href: string) {
        if (!this.epubPackage) return;
        console.log("ReaderView.openContentUrl called with:", href);
        // Strip anchor
        const [path, anchor] = href.split('#');
        console.log("Looking for spine item with path:", path);
        const item = this.epubPackage.spine.getItemByHref(path);
        if (item) {
            console.log("Found item:", item);

            // If it's the same item, just scroll
            if (this.currentItem && this.currentItem.href === item.href) {
                if (anchor) this.scrollToAnchor(anchor);
                return;
            }

            this.currentPageIndex = 0;
            await this.openSpineItem(item);

            if (anchor) {
                // Give the DOM a moment to render/layout before calculating offset
                // Using a small timeout to let the browser paint/layout the new content
                setTimeout(() => {
                    this.scrollToAnchor(anchor);
                }, 100);
            }
        }
        else {
            console.warn("Item not found for href", href);
            console.log("Available spine items:", this.epubPackage.spine.items.map(i => i.href));
        }
    }

    private scrollToAnchor(anchor: string) {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const doc = this.iframe.contentDocument;
        const el = doc.getElementById(anchor);
        if (el) {
            const html = doc.documentElement;
            // Calculate page index
            // In horizontal paginated mode (CSS columns):
            // The element's offsetLeft tells us how far 'right' it is in the scrollable strip.

            // Note: In Chrome/Webkit CSS columns, getBoundingClientRect().left is relative to viewport? 
            // Better to use offsets relative to the scrolled document if possible, 
            // but the doc itself is shifted.

            // Current shift
            const currentLeftShift = Math.abs(parseFloat(html.style.left || "0"));

            const rect = el.getBoundingClientRect();
            // True offset from start of book content = visible_position + current_scrolled_amount
            const absoluteLeft = rect.left + currentLeftShift;

            const viewWidth = this.iframe.clientWidth;
            const singlePageWidth = viewWidth + this.columnGap;

            // Page Index
            // We verify if we are in scroll mode or paginated
            if (this.currentSettings.scroll === 'scroll-continuous') {
                el.scrollIntoView();
                return;
            }

            let pageIndex = Math.floor(absoluteLeft / singlePageWidth);

            console.log(`Scrolling to anchor #${anchor}: absLeft=${absoluteLeft}, pageIndex=${pageIndex}`);

            this.currentPageIndex = pageIndex;
            // Clamp
            if (this.currentPageIndex >= this.pageCount) this.currentPageIndex = this.pageCount - 1;
            if (this.currentPageIndex < 0) this.currentPageIndex = 0;

            this.scrollToPage(this.currentPageIndex);
        } else {
            console.warn(`Anchor element #${anchor} not found`);
        }
    }


    private async injectResources(html: string, contextHref: string): Promise<string> {
        // Simple regex or DOM parser to replace src="..."
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Handle Images <img>
        const images = Array.from(doc.querySelectorAll('img'));
        for (const img of images) {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                // Resolve src relative to contextHref (spine item)
                const relativePath = this.resolvePath(contextHref, src);
                const blob = await this.epubPackage?.loadBlob(relativePath);
                if (blob) {
                    img.src = URL.createObjectURL(blob);
                }
            }
        }

        // Handle SVG Images <image xlink:href="...">
        const svgImages = Array.from(doc.querySelectorAll('image'));
        for (const img of svgImages) {
            const href = img.getAttribute('xlink:href') || img.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('data:')) {
                const relativePath = this.resolvePath(contextHref, href);
                const blob = await this.epubPackage?.loadBlob(relativePath);
                if (blob) {
                    // Set BOTH for compatibility
                    img.setAttribute('xlink:href', URL.createObjectURL(blob));
                    img.setAttribute('href', URL.createObjectURL(blob));
                }
            }
        }

        // Handle CSS
        const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
        for (const link of links) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http')) {
                const relativePath = this.resolvePath(contextHref, href);
                const text = await this.epubPackage?.loadFile(relativePath);
                if (text) {
                    const style = doc.createElement('style');
                    style.textContent = text;
                    link.replaceWith(style);
                }
            }
        }

        return doc.documentElement.outerHTML;
    }

    private resolvePath(base: string, relative: string): string {
        try {
            // Handle absolute paths /OEBPS/... (unlikely in standard hrefs but possible)
            if (relative.startsWith('/')) return relative.substring(1);

            const stack = base.split("/");
            stack.pop(); // remove current filename

            const parts = relative.split("/");
            for (const part of parts) {
                if (part === ".") continue;
                if (part === "..") stack.pop();
                else stack.push(part);
            }
            return stack.join("/");
        } catch (e) {
            console.error("Path resolution error", base, relative);
            return relative;
        }
    }
}
