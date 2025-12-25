export interface ReaderTheme {
    name: string;
    properties: {
        "background-color": string;
        "color": string;
        "font-family"?: string;
        [key: string]: string | undefined;
    };
    // Optional: Advanced CSS injection for specific needs
    css?: string;
}

export class ThemeManager {
    private static instance: ThemeManager;
    private themes: Map<string, ReaderTheme> = new Map();

    private constructor() {
        // Register default themes
        this.registerDefaultThemes();
    }

    public static getInstance(): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    public registerTheme(theme: ReaderTheme) {
        this.themes.set(theme.name, theme);
    }

    public getTheme(name: string): ReaderTheme | undefined {
        // Handle mapped aliases for backward compatibility
        const resolvedName = this.resolveThemeAlias(name);
        return this.themes.get(resolvedName);
    }

    private resolveThemeAlias(name: string): string {
        switch (name) {
            case 'day': return 'default-theme';
            case 'night': return 'night-theme';
            case 'sepia': return 'parchment-theme';
            case 'kindle': return 'kindle-paper-theme';
            case 'navy': return 'navy-theme';
            case 'author-theme': return 'default-theme'; // Fallback
            default: return name;
        }
    }

    private registerDefaultThemes() {
        this.registerTheme({
            name: "default-theme",
            properties: {
                "background-color": "white",
                "color": "black"
            }
        });

        this.registerTheme({
            name: "night-theme",
            properties: {
                "background-color": "#141414",
                "color": "white"
            }
        });

        this.registerTheme({
            name: "parchment-theme",
            properties: {
                "background-color": "#f7f1cf",
                "color": "#774c27"
            }
        });

        this.registerTheme({
            name: "kindle-paper-theme",
            properties: {
                "background-color": "#f6efdf",
                "color": "#2e2e2e",
                "font-family": "'Bookerly', 'Georgia', serif"
            }
        });

        this.registerTheme({
            name: "ballard-theme",
            properties: {
                "background-color": "#576b96",
                "color": "#DDD"
            }
        });

        this.registerTheme({
            name: "vancouver-theme",
            properties: {
                "background-color": "#DDD",
                "color": "#576b96"
            }
        });

        this.registerTheme({
            name: "navy-theme",
            properties: {
                "background-color": "#1c2938",
                "color": "#DDD"
            }
        });
    }
}
