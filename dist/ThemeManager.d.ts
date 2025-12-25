export interface ReaderTheme {
    name: string;
    properties: {
        "background-color": string;
        "color": string;
        "font-family"?: string;
        [key: string]: string | undefined;
    };
    css?: string;
}
export declare class ThemeManager {
    private static instance;
    private themes;
    private constructor();
    static getInstance(): ThemeManager;
    registerTheme(theme: ReaderTheme): void;
    getTheme(name: string): ReaderTheme | undefined;
    private resolveThemeAlias;
    private registerDefaultThemes;
}
