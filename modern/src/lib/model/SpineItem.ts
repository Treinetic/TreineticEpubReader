// SpineItem.ts
import { Spine } from './Spine';

export class SpineItem {
    idref: string;
    href: string;
    cfi: string;
    linear: string;
    page_spread: string;
    rendition_viewport?: string;
    rendition_spread?: string;
    rendition_orientation?: string;
    rendition_layout?: string;
    rendition_flow?: string;
    media_overlay_id?: string;
    media_type?: string;
    index: number;
    spine: Spine;

    static readonlyRENDITION_LAYOUT_REFLOWABLE = "reflowable";
    static readonlyRENDITION_LAYOUT_PREPAGINATED = "pre-paginated";

    static readonly SPREAD_LEFT = "page-spread-left";
    static readonly SPREAD_RIGHT = "page-spread-right";
    static readonly SPREAD_CENTER = "page-spread-center";
    static readonly SPREAD_NONE = "none";
    static readonly SPREAD_AUTO = "auto";

    static readonly FLOW_PAGINATED = "paginated";
    static readonly FLOW_SCROLLED_CONTINUOUS = "scrolled-continuous";
    static readonly FLOW_SCROLLED_DOC = "scrolled-doc";
    static readonly FLOW_AUTO = "auto";

    constructor(itemData: any, index: number, spine: Spine) {
        this.idref = itemData.idref;
        this.href = itemData.href;
        this.cfi = itemData.cfi;
        this.linear = itemData.linear ? itemData.linear.toLowerCase() : "yes";
        this.page_spread = itemData.page_spread;
        this.index = index;
        this.spine = spine;

        // Rendition properties
        this.rendition_viewport = itemData.rendition_viewport;
        this.rendition_spread = itemData.rendition_spread;
        this.rendition_layout = itemData.rendition_layout;
        this.rendition_flow = itemData.rendition_flow;
        this.media_type = itemData.media_type;
        this.media_overlay_id = itemData.media_overlay_id;

        this.validateSpread();
    }

    private validateSpread() {
        if (this.page_spread &&
            this.page_spread !== SpineItem.SPREAD_LEFT &&
            this.page_spread !== SpineItem.SPREAD_RIGHT &&
            this.page_spread !== SpineItem.SPREAD_CENTER) {
            console.warn(`${this.page_spread} is not a recognized spread type`);
        }
    }

    // Helpers
    isReflowable(): boolean {
        return !this.isFixedLayout();
    }

    isFixedLayout(): boolean {
        // Logic to check own property, then package property
        const localLayout = this.getRenditionLayout();
        if (localLayout) {
            return localLayout === SpineItem.RENDITION_LAYOUT_PREPAGINATED;
        }
        // Check package (parent)
        return this.spine.package.isFixedLayout();
    }

    getRenditionLayout() {
        return this.rendition_layout || this.spine.package.rendition_layout;
    }

    // Additional methods based on legacy SpineItem.js...
    static alternateSpread(spread: string): string {
        if (spread === SpineItem.SPREAD_LEFT) return SpineItem.SPREAD_RIGHT;
        if (spread === SpineItem.SPREAD_RIGHT) return SpineItem.SPREAD_LEFT;
        return spread;
    }
}
