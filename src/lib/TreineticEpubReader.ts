// TreineticEpubReader.ts
import { ModuleConfig } from './ModuleConfig';
import { Settings } from './Settings';
import { TOCJsonCreator } from './TOCJsonCreator';
import { ExternalControls } from './ExternalControls';
import { TreineticHelpers } from './TreineticHelpers';
import { Keyboard } from './Keyboard';
import { EpubParser } from './parser/EpubParser';
import { ReaderView } from './view/ReaderView';

// Declare globals that might be available from the legacy bundle
declare const Readium: any;
declare const ReadiumSDK: any;
declare global {
    interface Window {
        READIUM: any;
    }
}

export const TreineticEpubReader = {
    readium: null as any,
    readerView: null as ReaderView | null, // Added property
    currentPackageDocument: null as any,
    ebookURL_filepath: null as string | null,
    embeded: true,

    init: (elementSelector: string) => {
        console.log("Initializing Modern TreineticEpubReader...");

        Keyboard.init();

        const element = document.querySelector(elementSelector) as HTMLElement;
        if (!element) {
            console.error(`Element ${elementSelector} not found`);
            return;
        }

        TreineticEpubReader.initReader(element);
        return ExternalControls.getInstance();
    },

    open: (epubUrlOrFolder: string) => {
        console.log("Opening: ", epubUrlOrFolder);
        const settings = TreineticEpubReader.setReaderPreferences();
        TreineticEpubReader.ebookURL_filepath = epubUrlOrFolder; // Simplify for now

        const openPageRequest = TreineticEpubReader.getOpenPageRequest(settings, epubUrlOrFolder);

        let readerSettings = { syntheticSpread: "auto", scroll: "auto" };
        if (TreineticEpubReader.embeded && settings && settings.reader) {
            readerSettings = settings.reader;
        }

        TreineticEpubReader.loadEpub(readerSettings, epubUrlOrFolder, openPageRequest);
    },

    initReader: (element: HTMLElement) => {
        element.classList.add('tr-epub-reader-element');

        const settings = TreineticEpubReader.setReaderPreferences();

        // Initialize View
        TreineticEpubReader.readerView = new ReaderView(element);

        // Setup Keyboard
        Keyboard.init();

        // TreineticEpubReader.handleLegacyEvents(); // Placeholder if we need to port event handling logic from legacy which was huge

        let readerSettings = { syntheticSpread: "auto", scroll: "auto" };
        if (TreineticEpubReader.embeded && settings && settings.reader) {
            readerSettings = settings.reader;
        }

        // TreineticHelpers.updateReader(TreineticEpubReader.readerView, readerSettings);
    },

    handleReaderEvents: () => {
        if (!TreineticEpubReader.readium) return;

        const reader = TreineticEpubReader.readium.reader;

        // Assume ReadiumSDK logic (using strings for events if SDK var not available)
        const CONTENT_DOCUMENT_LOAD_START = ReadiumSDK?.Events?.CONTENT_DOCUMENT_LOAD_START || "CONTENT_DOCUMENT_LOAD_START";
        const CONTENT_DOCUMENT_LOADED = ReadiumSDK?.Events?.CONTENT_DOCUMENT_LOADED || "CONTENT_DOCUMENT_LOADED";
        const PAGINATION_CHANGED = ReadiumSDK?.Events?.PAGINATION_CHANGED || "PAGINATION_CHANGED";

        reader.on(CONTENT_DOCUMENT_LOAD_START, ($iframe: any, spineItem: any) => {
            console.log("Event: Load Start");
            // spin(true);
        });

        reader.on(CONTENT_DOCUMENT_LOADED, ($iframe: any, spineItem: any) => {
            console.log("Event: Loaded");
            // spin(false);
        });

        reader.on(PAGINATION_CHANGED, (pageChangeData: any) => {
            console.log("Event: Pagination Changed");
            if (ExternalControls.getInstance().isAutoBookmark()) {
                TreineticEpubReader.savePlace();
            }
        });
    },

    loadEpub: async (readerSettings: any, ebookURL: string, openPageRequest: any) => {
        try {
            console.log("Loading epub via modern parser:", ebookURL);
            const epubPackage = await EpubParser.load(ebookURL);

            if (TreineticEpubReader.readerView) {
                TreineticEpubReader.readerView.openBook(epubPackage);
                TreineticEpubReader.currentPackageDocument = epubPackage;

                if (epubPackage.toc) {
                    ExternalControls.getInstance().onTOCLoad(epubPackage.toc);
                }

                ExternalControls.getInstance().epubLoaded(
                    epubPackage.metadata,
                    epubPackage,
                    TreineticEpubReader.readerView
                );
            }
        } catch (e) {
            console.error("Failed to load epub", e);
            ExternalControls.getInstance().epubFailed("Indeterminate error");
        }
    },

    setReaderPreferences: () => {
        // Simplified
        let readerSettings = Settings.get('reader') || { fontSize: 100, theme: 'default-theme', scroll: 'scroll-continuous' };
        Settings.put('reader', readerSettings);
        return { reader: readerSettings };
    },

    getOpenPageRequest: (settings: any, ebookURL: string) => {
        // Simplified
        return null;
    },

    savePlace: () => {
        // TODO: Implement simple local storage bookmark
    },

    // Public API Methods (proxied to handler/helpers)
    nextPage: () => ExternalControls.getInstance().nextPage(),
    prevPage: () => ExternalControls.getInstance().prevPage(),
    goToPage: (href: string) => ExternalControls.getInstance().goToPage(href),
    setTheme: (theme: string) => {
        // Update settings
        ExternalControls.getInstance().setTheme(theme);
    },
    setFontSize: (size: number) => {
        ExternalControls.getInstance().changeFontSize(size);
    },
    setScrollOption: (type: 'auto' | 'scroll-continuous') => {
        ExternalControls.getInstance().setScrollOption(type);
    }
};

