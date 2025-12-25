// TreineticHelpers.ts
import { Settings } from './Settings';
import { ThemeManager } from './ThemeManager';

export const TreineticHelpers = {
    updateReader: (reader: any, readerSettings: any) => {
        if (!reader) return;

        reader.updateSettings(readerSettings);
        if (readerSettings.theme) {
            document.documentElement.setAttribute("data-theme", readerSettings.theme);
            const bookStyles = TreineticHelpers.getBookStyles(readerSettings.theme);
            reader.setBookStyles(bookStyles);

            // Apply background color to frame wrapper to prevent white borders
            const frame = document.querySelector('#reader-wrapper') as HTMLElement;
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
        const fontFamily = TreineticHelpers.getPropertyFromThemeClass(theme, "font-family");

        return [{
            selector: ':not(a):not(hypothesis-highlight)',
            declarations: {
                backgroundColor: isAuthorTheme ? "" : bgColor,
                color: isAuthorTheme ? "" : color,
                fontFamily: isAuthorTheme ? "" : (fontFamily || "")
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
        const theme = ThemeManager.getInstance().getTheme(classOrId);
        return theme ? theme.properties[property] : null;
    }
};
