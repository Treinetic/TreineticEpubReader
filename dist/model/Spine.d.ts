import { Package } from './Package';
import { SpineItem } from './SpineItem';
export declare class Spine {
    package: Package;
    items: SpineItem[];
    direction: string;
    private handleLinear;
    constructor(epubPackage: Package, spineDTO?: any);
    isValidLinearItem(index: number): boolean;
    item(index: number): SpineItem | undefined;
    getItemByHref(href: string): SpineItem | undefined;
    first(): SpineItem | undefined;
    firstLinear(): SpineItem | undefined;
    nextItem(item: SpineItem): SpineItem | undefined;
    prevItem(item: SpineItem): SpineItem | undefined;
    nextLinear(item: SpineItem): SpineItem | undefined;
    prevLinear(item: SpineItem): SpineItem | undefined;
    last(): SpineItem | undefined;
}
