// EpubParser.ts
import JSZip from 'jszip';
import { Package } from '../model/Package';

export class EpubParser {

    static async load(rootUrl: string): Promise<Package> {
        let zip: JSZip | null = null;
        let fileFetcher: (path: string) => Promise<string | null> = async (p) => {
            const res = await fetch(rootUrl + (rootUrl.endsWith('/') ? '' : '/') + p);
            if (res.ok) return res.text();
            return null;
        };

        // Try to fetch as blob to check if it's a zip
        // Optimization: If url ends in .epub, assume zip
        if (rootUrl.toLowerCase().endsWith('.epub')) {
            try {
                const response = await fetch(rootUrl);
                const buffer = await response.arrayBuffer();
                // Basic check if zip signature or just try
                const loadedZip = await JSZip.loadAsync(buffer);
                zip = loadedZip;
                fileFetcher = async (p) => {
                    const file = zip?.file(p);
                    if (file) return await file.async("string");
                    // Case insensitive search?
                    return null;
                };
            } catch (e) {
                console.warn("Retrying as unzipped folder...", e);
            }
        }

        // 1. Fetch container.xml
        const containerXml = await fileFetcher('META-INF/container.xml');
        if (!containerXml) throw new Error("Could not find META-INF/container.xml");

        const parser = new DOMParser();
        const containerDoc = parser.parseFromString(containerXml, "application/xml");

        const rootfile = containerDoc.querySelector("rootfile");
        if (!rootfile) throw new Error("No rootfile in container.xml");

        const opfPath = rootfile.getAttribute("full-path");
        if (!opfPath) throw new Error("No full-path in rootfile");

        // 2. Fetch OPF
        const opfXml = await fileFetcher(opfPath);
        if (!opfXml) throw new Error("Could not find OPF: " + opfPath);

        const opfDoc = parser.parseFromString(opfXml, "application/xml");

        // 3. Parse OPF into PackageData
        return await EpubParser.parseOpf(opfDoc, rootUrl, opfPath, fileFetcher, zip);
    }

    private static async parseOpf(doc: Document, rootUrl: string, opfPath: string, fileFetcher: (p: string) => Promise<string | null>, zip: JSZip | null): Promise<Package> {
        const metadataNode = doc.querySelector("metadata");
        const manifestNode = doc.querySelector("manifest");
        const spineNode = doc.querySelector("spine");

        if (!metadataNode || !manifestNode || !spineNode) throw new Error("Invalid OPF");

        // Parse Metadata
        const metadata = {
            title: metadataNode.querySelector("title")?.textContent || "Unknown Title",
            creator: metadataNode.querySelector("creator")?.textContent || "",
            language: metadataNode.querySelector("language")?.textContent || "",
            identifier: metadataNode.querySelector("identifier")?.textContent || "",
            pubDate: metadataNode.querySelector("date")?.textContent || "",
        };

        // Parse Manifest (Map ID -> Href)
        const manifest: { [key: string]: string } = {};
        manifestNode.querySelectorAll("item").forEach(item => {
            const id = item.getAttribute("id");
            const href = item.getAttribute("href");
            if (id && href) manifest[id] = href;
        });

        // Parse Spine
        const spineItems: any[] = [];
        const opfDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
        const packageRoot = rootUrl + opfDir;

        spineNode.querySelectorAll("itemref").forEach((itemref) => {
            const idref = itemref.getAttribute("idref");
            if (idref && manifest[idref]) {
                spineItems.push({
                    idref: idref,
                    href: manifest[idref], // This is relative to OPF
                    linear: itemref.getAttribute("linear") || "yes"
                });
            }
        });

        // Parse TOC (NCX)
        let toc: any[] = [];
        const spineTocId = spineNode.getAttribute("toc"); // NCX id
        if (spineTocId && manifest[spineTocId]) {
            const ncxPath = manifest[spineTocId];
            // Combine paths correctly? opfDir + ncxPath?
            // manifest href is relative to OPF
            const opfDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
            const fullNcxPath = opfDir + ncxPath; // This assumes standard relative path

            try {
                const ncxXml = await fileFetcher(fullNcxPath);
                if (ncxXml) {
                    const parser = new DOMParser();
                    const ncxDoc = parser.parseFromString(ncxXml, "application/xml");
                    toc = EpubParser.parseNcx(ncxDoc);
                }
            } catch (e) {
                console.warn("Failed to parse NCX", e);
            }
        }

        return new Package({
            rootUrl: packageRoot, // The root for resolving spine items
            metadata: metadata,
            spine: {
                items: spineItems
            },
            toc: toc,
            zip: zip,
            rendition_layout: metadataNode.querySelector("meta[property='rendition:layout']")?.textContent || "reflowable"
        });
    }

    private static parseNcx(ncxDoc: Document): any[] {
        const navMap = ncxDoc.querySelector("navMap");
        if (!navMap) return [];

        const parsePoints = (parent: Element): any[] => {
            const points: any[] = [];
            Array.from(parent.children).forEach(child => {
                if (child.tagName.toLowerCase() === 'navpoint') {
                    const label = child.querySelector("navLabel > text")?.textContent || "Untitled";
                    const content = child.querySelector("content")?.getAttribute("src") || "";
                    const sub = parsePoints(child);
                    points.push({ name: label, Id_link: content, sub: sub });
                }
            });
            return points;
        };

        return parsePoints(navMap);
    }
}
