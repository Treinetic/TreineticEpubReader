define([],function () {
    function updateReader(reader, readerSettings) {
        reader.updateSettings(readerSettings); // triggers on pagination changed
        if (readerSettings.theme) {
            $("html").attr("data-theme", readerSettings.theme);
            var bookStyles = getBookStyles(readerSettings.theme);
            reader.setBookStyles(bookStyles);
            $('.tr-epub-reader-element').css(bookStyles[0].declarations);
        }
        Settings.put('reader', readerSettings);
    }

    function getBookStyles(theme) {
        var isAuthorTheme = (theme === "author-theme");
        var bgColor = getPropertyFromThemeClass(theme, "background-color");
        var color = getPropertyFromThemeClass(theme, "color");
        return [{
            selector: ':not(a):not(hypothesis-highlight)', // or "html", or "*", or "", or undefined (styles applied to whole document)
            declarations: {
                backgroundColor: isAuthorTheme ? "" : bgColor,
                color: isAuthorTheme ? "" : color
            }
        }, {
            selector: 'a', // so that hyperlinks stand out (otherwise they are invisible, and we do not have a configured colour scheme for each theme (TODO? add hyperlinks colours in addition to basic 2x params backgroundColor and color?).
            declarations: {
                backgroundColor: isAuthorTheme ? "" : bgColor,
                color: isAuthorTheme ? "" : color
            }
        }];
    }

    function getPropertyFromThemeClass(classOrId, property) {
        if (classOrId === "author-theme") {
            classOrId = "default-theme";
        }
        var themes = {
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
            }
        };
        return themes[classOrId][property];
    }

    return {
        updateReader : updateReader
    }
});
