export declare class ExternalControls {
    private static instance;
    metadata: any;
    reader: any;
    channel: any;
    auto_bookmark: boolean;
    TocJsonObject: any;
    currentPackageDocument: any;
    readerSettings: any;
    callbackFunctions: {
        [key: string]: Function;
    };
    private constructor();
    static getInstance(): ExternalControls;
    static createInstance(): void;
    epubLoaded(metadata: any, currentPackageDocument: any, reader: any): void;
    registerEvent(eventName: string, func: Function): void;
    epubFailed(error: any): void;
    registerChannel(func: Function): void;
    onTOCLoad(tocJson: any): void;
    getReaderHeight(): number | null;
    nextPage(): void;
    prevPage(): void;
    hasNextPage(): boolean;
    hasPrevPage(): boolean;
    makeBookMark(): void;
    setAutoBookmark(val: boolean): void;
    isAutoBookmark(): boolean;
    getTOCJson(): string;
    hasTOC(): boolean;
    goToPage(href: string): void;
    changeFontSize(size: number): void;
    getRecommendedFontSizeRange(): {
        min: number;
        max: number;
    };
    setTheme(theme_id: string): void;
    setScrollOption(type: 'auto' | 'scroll-continuous'): void;
    private cloneUpdate;
}
