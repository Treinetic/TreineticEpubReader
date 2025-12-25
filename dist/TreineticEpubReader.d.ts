import { ExternalControls } from './ExternalControls';
import { ReaderView } from './view/ReaderView';
import { ReaderTheme } from './ThemeManager';
declare global {
    interface Window {
        READIUM: any;
    }
}
declare const TreineticEpubReader: {
    readium: any;
    readerView: ReaderView | null;
    currentPackageDocument: any;
    ebookURL_filepath: string | null;
    embeded: boolean;
    init: (selectorOrElement: string | HTMLElement) => ExternalControls | null;
    /**
     * Alias for init() to align with standard library patterns.
     */
    create: (selectorOrElement: string | HTMLElement) => ExternalControls | null;
    open: (epubUrlOrFolder: string) => void;
    initReader: (element: HTMLElement) => void;
    handleReaderEvents: () => void;
    loadEpub: (_readerSettings: any, ebookURL: string, _openPageRequest: any) => Promise<void>;
    setReaderPreferences: () => {
        reader: any;
    };
    getOpenPageRequest: (_settings: any, _ebookURL: string) => null;
    savePlace: () => void;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (href: string) => void;
    setTheme: (theme: string) => void;
    registerTheme: (theme: ReaderTheme) => void;
    setFontSize: (size: number) => void;
    setScrollOption: (type: "auto" | "scroll-continuous") => void;
    clearSettings: () => void;
};
export default TreineticEpubReader;
