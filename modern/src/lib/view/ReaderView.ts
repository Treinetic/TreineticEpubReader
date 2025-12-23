// ReaderView.ts
import { Package } from '../model/Package';
import { SpineItem } from '../model/SpineItem';

export class ReaderView {
    container: HTMLElement;
    epubPackage?: Package;
    iframe?: HTMLIFrameElement;

    constructor(container: HTMLElement) {
        this.container = container;
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

    async openSpineItem(item: SpineItem) {
        // 1. Create/Reuse Iframe
        if (!this.iframe) {
            this.iframe = document.createElement('iframe');
            this.iframe.style.width = "100%";
            this.iframe.style.height = "100%";
            this.iframe.style.border = "none";
            this.container.appendChild(this.iframe);
        }

        // 2. Load Content
        if (this.epubPackage) {
            let content = await this.epubPackage.loadFile(item.href);
            if (content) {
                // 2.b Process content for resources if zipped
                if (this.epubPackage.zip) {
                    content = await this.injectResources(content, item.href);
                }

                // Render
                this.iframe.srcdoc = content;

                this.iframe.onload = () => {
                    this.initFrameContent();
                };

                console.log(`Loading spine item: ${item.href}`);
                this.currentItem = item;
            } else {
                console.error("Failed to load content for", item.href);
            }
        }
    }

    // Pagination & Style State
    private columnGap = 40;
    private currentPageIndex = 0;
    private pageCount = 0;
    private currentSettings: any = {};

    private initFrameContent() {
        if (!this.iframe || !this.iframe.contentDocument) return;

        const doc = this.iframe.contentDocument;
        const html = doc.documentElement;
        const body = doc.body;

        // Apply Styles
        this.applySettingsToDoc(doc);

        // Setup Pagination (CSS Columns)
        // Wait for images? or assume loaded?
        // Let's force a layout update
        this.updatePagination();

        // Listen for Resize
        window.addEventListener('resize', () => {
            this.updatePagination();
        });

        // Handle case where we came from previous chapter and need to go to last page
        if (this.currentPageIndex < 0) {
            this.currentPageIndex = this.pageCount - 1;
            this.scrollToPage(this.currentPageIndex);
        }
    }

    public updateSettings(settings: any) {
        this.currentSettings = { ...this.currentSettings, ...settings };
        if (this.iframe && this.iframe.contentDocument) {
            this.applySettingsToDoc(this.iframe.contentDocument);
            this.updatePagination();
        }
    }

    public setBookStyles(styles: any[]) {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const doc = this.iframe.contentDocument;

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

        styleEl.textContent = css;
        doc.head.appendChild(styleEl);
    }

    private applySettingsToDoc(doc: Document) {
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
        // We set styles on HTML to create columns that overflow horizontally
        html.style.height = `${height}px`;
        html.style.width = '100%'; // Not 100vw, but 100% of iframe

        // Important: Position relative to allow shifting
        html.style.position = 'relative';
        html.style.margin = '0';
        html.style.padding = '0';
        html.style.top = '0';
        html.style.left = '0'; // Start at 0

        // Create Columns
        html.style.columnWidth = `${width - this.columnGap}px`;
        html.style.columnGap = `${this.columnGap}px`;
        html.style.columnFill = 'auto';

        // Ensure body doesn't mess it up
        body.style.margin = '0';
        body.style.padding = '0';

        // Hide scrollbars on the IFRAME itself
        if (this.iframe) this.iframe.style.overflow = 'hidden';
    }

    private updatePagination() {
        if (!this.iframe || !this.iframe.contentDocument) return;
        const html = this.iframe.contentDocument.documentElement;

        // Measure exact column width (might slightly differ from calc)
        // Legacy assumes fixed width columns based on viewport
        const viewWidth = this.iframe.clientWidth;

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

        // Use 'left' as legacy did
        html.style.left = `-${offset}px`;
    }

    currentItem?: SpineItem;


    async openContentUrl(href: string) {
        if (!this.epubPackage) return;
        // Strip anchor
        const [path, anchor] = href.split('#');
        const item = this.epubPackage.spine.getItemByHref(path);
        if (item) {
            this.currentPageIndex = 0;
            await this.openSpineItem(item);
            // TODO: Handle anchor scrolling
        }
        else console.warn("Item not found for href", href);
    }

    private async injectResources(html: string, contextHref: string): Promise<string> {
        // Simple regex or DOM parser to replace src="..."
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Handle Images
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
        const stack = base.split("/");
        stack.pop(); // remove current filename

        const parts = relative.split("/");
        for (const part of parts) {
            if (part === ".") continue;
            if (part === "..") stack.pop();
            else stack.push(part);
        }
        return stack.join("/");
    }
}
