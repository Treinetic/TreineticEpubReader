// Spine.ts
import { Package } from './Package';
import { SpineItem } from './SpineItem';

export class Spine {
    package: Package;
    items: SpineItem[] = [];
    direction: string = "ltr";

    private handleLinear: boolean = true; // Default behavior

    constructor(epubPackage: Package, spineDTO?: any) {
        this.package = epubPackage;

        if (spineDTO) {
            this.direction = spineDTO.direction || "ltr";
            if (spineDTO.items) {
                spineDTO.items.forEach((itemDTO: any, index: number) => {
                    this.items.push(new SpineItem(itemDTO, index, this));
                });
            }
        }
    }

    isValidLinearItem(index: number): boolean {
        if (index < 0 || index >= this.items.length) return false;
        const item = this.items[index];
        if (!this.handleLinear) return true; // check this logic
        return item.linear !== "no";
    }

    item(index: number): SpineItem | undefined {
        return this.items[index];
    }

    getItemByHref(href: string): SpineItem | undefined {
        // Normalize logic needed here (URI resolution)
        return this.items.find(item => href.endsWith(item.href) || item.href.endsWith(href));
    }

    first(): SpineItem | undefined {
        return this.items[0];
    }

    firstLinear(): SpineItem | undefined {
        return this.items.find(item => item.linear !== 'no');
    }

    nextItem(item: SpineItem): SpineItem | undefined {
        const nextIndex = item.index + 1;
        if (nextIndex < this.items.length) return this.items[nextIndex];
        return undefined;
    }

    prevItem(item: SpineItem): SpineItem | undefined {
        const prevIndex = item.index - 1;
        if (prevIndex >= 0) return this.items[prevIndex];
        return undefined;
    }

    nextLinear(item: SpineItem): SpineItem | undefined {
        let index = item.index + 1;
        while (index < this.items.length) {
            if (this.items[index].linear !== 'no') return this.items[index];
            index++;
        }
        return undefined;
    }

    prevLinear(item: SpineItem): SpineItem | undefined {
        let index = item.index - 1;
        while (index >= 0) {
            if (this.items[index].linear !== 'no') return this.items[index];
            index--;
        }
        return undefined;
    }

    last(): SpineItem | undefined {
        return this.items[this.items.length - 1];
    }
}
