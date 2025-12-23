// TreineticHelpers.ts
import { Settings } from './Settings';

export const TreineticHelpers = {
    updateReader: (reader: any, readerSettings: any) => {
        if (!reader) return;

        reader.updateSettings(readerSettings);
        if (readerSettings.theme) {
            document.documentElement.setAttribute("data-theme", readerSettings.theme);
            const bookStyles = TreineticHelpers.getBookStyles(readerSettings.theme);
            reader.setBookStyles(bookStyles);

            // Apply background color to frame
            const frame = document.querySelector('.desktop-reader-frame') as HTMLElement;
            if (frame && bookStyles[0].declarations.backgroundColor) {
                frame.style.backgroundColor = bookStyles[0].declarations.backgroundColor;
            }
        }
        Settings.put('reader', readerSettings);
    },

    getBookStyles: (theme: string) => {
        const isAuthorTheme = (theme === "author-theme");
        const bgColor = TreineticHelpers.getPropertyFromThemeClass(theme, "background-color");
        const color = TreineticHelpers.getPropertyFromThemeClass(theme, "color");

        return [{
            selector: ':not(a):not(hypothesis-highlight)',
            declarations: {
                backgroundColor: isAuthorTheme ? "" : bgColor,
                color: isAuthorTheme ? "" : color
            }
        }, {
            selector: 'a',
            declarations: {
                backgroundColor: isAuthorTheme ? "" : bgColor,
                color: isAuthorTheme ? "" : color
            }
        }];
    },

    getPropertyFromThemeClass: (classOrId: string, property: string) => {
        if (classOrId === "author-theme") {
            classOrId = "default-theme";
        }
        const themes: any = {
            "night-theme": {
                "background-color": "#141414",
                "color": "white"
            }, "default-theme": {
                "background-color": "white",
                "color": "black"
            }, "parchment-theme": {
                "background-color": "#f7f1cf",
                "color": "#774c27"
            }, "ballard-theme": {
                "background-color": "#576b96",
                "color": "#DDD"
            }, "vancouver-theme": {
                "background-color": "#DDD",
                "color": "#576b96"
            }, "navy-theme": { // Added navy/blue mapping if missing
                "background-color": "#1c2938",
                "color": "#DDD"
            }
        };
        // Map 'navy' to 'navy-theme' if passed like that
        if (classOrId === 'navy') classOrId = 'navy-theme';
        if (classOrId === 'day') classOrId = 'default-theme';
        if (classOrId === 'night') classOrId = 'night-theme';
        if (classOrId === 'sepia') classOrId = 'parchment-theme';

        return themes[classOrId] ? themes[classOrId][property] : null;
    }
};
