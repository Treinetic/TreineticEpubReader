export declare const Keyboard: {
    scope: string;
    handlers: {
        [key: string]: Function[];
    };
    init: () => void;
    on: (keyName: string, scope: string, callback: Function) => void;
    handleKey: (e: KeyboardEvent) => void;
    dispatch: (action: string) => void;
    PagePrevious: string;
    PageNext: string;
    NightTheme: string;
    applySettings: (_json: any) => void;
};
