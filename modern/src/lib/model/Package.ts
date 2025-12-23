import JSZip from 'jszip';
import { Spine } from './Spine';
import { Metadata } from './Metadata';

export class Package {
    rootUrl: string;
    rootUrlMO?: string;
    spine: Spine;
    metadata: Metadata; // Add metadata
    zip: JSZip | null; // Add zip property

    rendition_viewport?: string;
    rendition_layout?: string;
    rendition_flow?: string;
    rendition_orientation?: string;
    rendition_spread?: string;
    toc?: any;

    constructor(packageData: any) {
        this.rootUrl = packageData.rootUrl;
        this.rootUrlMO = packageData.rootUrlMO;

        this.rendition_layout = packageData.rendition_layout;
        this.rendition_flow = packageData.rendition_flow;
        this.rendition_spread = packageData.rendition_spread;

        this.spine = new Spine(this, packageData.spine);
        this.metadata = new Metadata(packageData.metadata);
        this.toc = packageData.toc;
        this.zip = packageData.zip || null;
    }

    resolveRelativeUrl(relativeUrl: string): string {
        // Logic to resolve against rootUrl
        if (this.rootUrl) {
            // Simple concatenation for now, needs proper URI handling
            if (this.rootUrl.endsWith('/')) return this.rootUrl + relativeUrl;
            return this.rootUrl + '/' + relativeUrl;
        }
        return relativeUrl;
    }

    isFixedLayout(): boolean {
        return this.rendition_layout === "pre-paginated";
    }

    async loadFile(relativePath: string): Promise<string | null> {
        if (this.zip) {
            // Improved logic to find the file inside the zip
            // 1. Try exact relative path (e.g. if relativePath is "OEBPS/chapter1.html")
            let file = this.zip.file(relativePath);
            if (file) return await file.async("string");

            // 2. Try resolving full URL and locating "inside" the epub URL
            const fullUrl = this.resolveRelativeUrl(relativePath);
            const idx = fullUrl.indexOf('.epub');
            if (idx !== -1) {
                // .../file.epub/OEBPS/chapter1.html -> OEBPS/chapter1.html
                // part after .epub
                let internalPath = fullUrl.substring(idx + 5);
                // remove leading slash or possible double slash
                if (internalPath.startsWith('/')) internalPath = internalPath.substring(1);

                // Some paths might be /OEBPS/chapter1.html, we need OEBPS/chapter1.html
                file = this.zip.file(internalPath);
                if (file) return await file.async("string");
            }

            // 3. Fallback: try removing leading slashes
            if (relativePath.startsWith('/')) {
                const sub = relativePath.substring(1);
                file = this.zip.file(sub);
                if (file) return await file.async("string");
            }

            console.warn("File not found in zip:", relativePath);
            return null;
            console.warn("File not found in zip:", relativePath);
            return null;
        } else {
            const url = this.resolveRelativeUrl(relativePath);
            const res = await fetch(url);
            if (res.ok) return await res.text();
            return null;
        }
    }

    async loadBlob(relativePath: string): Promise<Blob | null> {
        if (this.zip) {
            // Re-use logic for finding file
            let file = this.zip.file(relativePath);
            if (!file) {
                const fullUrl = this.resolveRelativeUrl(relativePath);
                const idx = fullUrl.indexOf('.epub');
                if (idx !== -1) {
                    let internalPath = fullUrl.substring(idx + 5);
                    if (internalPath.startsWith('/')) internalPath = internalPath.substring(1);
                    file = this.zip.file(internalPath);
                }
            }
            // Fallback
            if (!file && relativePath.startsWith('/')) {
                file = this.zip.file(relativePath.substring(1));
            }

            if (file) return await file.async("blob");
            return null;
        } else {
            const url = this.resolveRelativeUrl(relativePath);
            const res = await fetch(url);
            if (res.ok) return await res.blob();
            return null;
        }
    }
}
