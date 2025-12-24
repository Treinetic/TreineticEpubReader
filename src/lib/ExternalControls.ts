// ExternalControls.ts
import { Settings } from './Settings';
import { TreineticHelpers } from './TreineticHelpers';

export class ExternalControls {
    private static instance: ExternalControls | null = null;

    // Properties
    metadata: any = null;
    reader: any = null;
    channel: any = null;
    auto_bookmark: boolean = true;
    TocJsonObject: any = null;
    currentPackageDocument: any = null;
    readerSettings: any = null;
    callbackFunctions: { [key: string]: Function } = {};

    private constructor() { }

    public static getInstance(): ExternalControls {
        if (ExternalControls.instance === null) {
            ExternalControls.instance = new ExternalControls();
        }
        return ExternalControls.instance;
    }

    public static createInstance(): void {
        ExternalControls.instance = new ExternalControls();
    }

    // Methods
    public epubLoaded(metadata: any, currentPackageDocument: any, reader: any): void {
        this.metadata = metadata;
        this.reader = reader;
        this.currentPackageDocument = currentPackageDocument;

        Settings.get('reader', (settings: any) => {
            this.readerSettings = settings || this.readerSettings;
        });

        if (this.callbackFunctions["onEpubLoadSuccess"]) {
            this.callbackFunctions["onEpubLoadSuccess"]();
        }
    }

    public registerEvent(eventName: string, func: Function): void {
        this.callbackFunctions[eventName] = func;
    }

    public epubFailed(error: any): void {
        if (this.callbackFunctions["onEpubLoadFail"]) {
            this.callbackFunctions["onEpubLoadFail"](error);
        }
    }

    public registerChannel(func: Function): void {
        this.channel = func;
    }

    public onTOCLoad(tocJson: any): void {
        this.TocJsonObject = tocJson;
        if (this.callbackFunctions["onTOCLoaded"]) {
            this.callbackFunctions["onTOCLoaded"](this.TocJsonObject);
        }
    }

    public getReaderHeight(): number | null {
        if (this.callbackFunctions["onReaderHeightRequest"]) {
            return this.callbackFunctions["onReaderHeightRequest"]();
        }
        return null;
    }

    // Navigation
    public nextPage(): void {
        if (this.reader) this.reader.openPageRight();
    }

    public prevPage(): void {
        if (this.reader) this.reader.openPageLeft();
    }

    public hasNextPage(): boolean {
        return this.reader && this.reader.getPaginationInfo()?.canGoRight();
    }

    public hasPrevPage(): boolean {
        return this.reader && this.reader.getPaginationInfo()?.canGoPrev();
    }

    // Bookmarking
    public makeBookMark(): void {
        if (this.channel) this.channel("BOOKMARK_CURRENT_PAGE");
    }

    public setAutoBookmark(val: boolean): void {
        this.auto_bookmark = val;
    }

    public isAutoBookmark(): boolean {
        return this.auto_bookmark;
    }

    // TOC
    public getTOCJson(): string {
        return JSON.stringify(this.TocJsonObject ? this.TocJsonObject : []);
    }

    public hasTOC(): boolean {
        return this.TocJsonObject != null;
    }

    public goToPage(href: string): void {
        // Fix: Package model doesn't have getToc(), and ReaderView only needs href
        if (this.reader) this.reader.openContentUrl(href);
    }

    // Settings
    public changeFontSize(size: number): void {
        this.readerSettings = this.cloneUpdate(this.readerSettings, "fontSize", size);
        TreineticHelpers.updateReader(this.reader, this.readerSettings);
    }

    public getRecommendedFontSizeRange() {
        return { min: 60, max: 170 };
    }

    public setTheme(theme_id: string): void {
        this.readerSettings = this.cloneUpdate(this.readerSettings, "theme", theme_id);
        if (this.reader) TreineticHelpers.updateReader(this.reader, this.readerSettings);
    }

    public setScrollOption(type: 'auto' | 'scroll-continuous'): void {
        this.readerSettings = this.cloneUpdate(this.readerSettings, "scroll", type);
        if (this.reader) TreineticHelpers.updateReader(this.reader, this.readerSettings);
    }

    // ... helpers
    private cloneUpdate(object: any, attr: string, value: any): any {
        const newObject = object ? JSON.parse(JSON.stringify(object)) : {};
        newObject[attr] = value;
        return newObject;
    }
}
