import { default as JSZip } from 'jszip';
import { Spine } from './Spine';
import { Metadata } from './Metadata';
export declare class Package {
    rootUrl: string;
    rootUrlMO?: string;
    spine: Spine;
    metadata: Metadata;
    zip: JSZip | null;
    rendition_viewport?: string;
    rendition_layout?: string;
    rendition_flow?: string;
    rendition_orientation?: string;
    rendition_spread?: string;
    toc?: any;
    constructor(packageData: any);
    resolveRelativeUrl(relativeUrl: string): string;
    isFixedLayout(): boolean;
    loadFile(relativePath: string): Promise<string | null>;
    loadBlob(relativePath: string): Promise<Blob | null>;
}
