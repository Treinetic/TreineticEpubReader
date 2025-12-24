define(['./TOCJsonCreator', 'Settings', './TreineticHelpers'], function (TOCJsonCreator, Settings, TreineticHelpers) {
    var externalcontrols = null;

    var ExternalControls = function () {
        this.metadata = null;
        this.reader = null;
        this.channel = null;
        this.auto_bookmark = true;
        this.TocJsonObject = null;
        this.currentPackageDocument = null;
        this.readerSettings = null;
        this.callbackFunctions = {};
    };

    ExternalControls.prototype.epubLoaded = function (metadata, currentPackageDocument, reader) {
            var self = this;
            this.metadata = metadata;
            this.reader = reader;
            this.currentPackageDocument = currentPackageDocument;

            Settings.get('reader', function (readerSettings) {
                var readerSettings = readerSettings || self.readerSettings;
                self.readerSettings = readerSettings;
            });

            if(this.callbackFunctions["onEpubLoadSuccess"]){
                this.callbackFunctions["onEpubLoadSuccess"]();
            }
    };

    ExternalControls.prototype.registerEvent = function (eventName,func) {
        this.callbackFunctions[eventName] = func;
    };

    ExternalControls.prototype.epubFailed = function (error) {
        if(this.callbackFunctions["onEpubLoadFail"]){
            this.callbackFunctions["onEpubLoadFail"](error);
        }
    };

    ExternalControls.prototype.registerChannel = function (func) {
        this.channel = func;
    };

    ExternalControls.prototype.onTOCLoad = function (tocJson) {
        this.TocJsonObject = tocJson;
        if(this.callbackFunctions["onTOCLoaded"]){
            this.callbackFunctions["onTOCLoaded"](this.TocJsonObject);
        }
    };

    ExternalControls.prototype.getReaderHeight = function(){
            if(this.callbackFunctions["onReaderHeightRequest"]){
                return this.callbackFunctions["onReaderHeightRequest"]();
            }
            return null;
    };


    /* ----------- RELATED TO PAGES NAVIGATION ----------- */
    ExternalControls.prototype.nextPage = function () {
        this.reader.openPageRight();
    };

    ExternalControls.prototype.prevPage = function () {
        this.reader.openPageLeft();
    };

    ExternalControls.prototype.hasNextPage = function () {
        return this.reader.getPaginationInfo().canGoRight();
    };

    ExternalControls.prototype.hasPrevPage = function () {
        return this.reader.getPaginationInfo().canGoPrev();
    };
    /* ----------- RELATED TO PAGES NAVIGATION END ----------- */


    /* ----------- RELATED BOOKMARK ----------- */
    ExternalControls.prototype.makeBookMark = function () {
        this.channel("BOOKMARK_CURRENT_PAGE");
    };

    ExternalControls.prototype.setAutoBookmark = function ($boolean) {
        this.auto_bookmark = $boolean;
    };

    ExternalControls.prototype.isAutoBookmark = function () {
        return this.auto_bookmark;
    };
    /* ----------- RELATED BOOKMARK END ----------- */


    /* ----------- RELATED TOC ----------- */
    ExternalControls.prototype.getTOCJson = function () {
        return JSON.stringify(this.TocJsonObject ? this.TocJsonObject : []);
    };

    ExternalControls.prototype.hasTOC = function () {
        return (this.TocJsonObject != null);
    };

    ExternalControls.prototype.goToPage = function (href) {
        var tocUrl = this.currentPackageDocument.getToc();
        this.reader.openContentUrl(href, tocUrl, undefined);
    };
    /* ---------- RELATED TOC END -------- */

    /* ---------- RELATED TO SETTINGS ----- */

    ExternalControls.prototype.changeFontSize = function (size) {
        this.readerSettings = cloneUpdate(this.readerSettings, "fontSize", size);
        TreineticHelpers.updateReader(this.reader, this.readerSettings);
    };

    ExternalControls.prototype.getRecommendedFontSizeRange = function () {
        return {min: 60, max: 170}
    };

    ExternalControls.prototype.getAvailableThemes = function () {
        return [
            {name: "Author Style", id: "author-theme"},
            {name: "Black & White", id: "default-theme"},
            {name: "Night Mode", id: "night-theme"},
            {name: "Old Theame", id: "parchment-theme"},
            {name: "Blue Theme", id: "ballard-theme"},
            {name: "Vancouver Theme", id: "vancouver-theme"}
        ]
    };

    ExternalControls.prototype.setTheme = function (theme_id) {
        this.readerSettings = cloneUpdate(this.readerSettings, "theme", theme_id);
        TreineticHelpers.updateReader(this.reader, this.readerSettings);
    };

    ExternalControls.prototype.getAvailableScrollModes = function () {
        return [
            {name: "Automatic", id: "auto"},
            {name: "Scroll Document", id: "scroll-doc"},
            {name: "Scroll Continuous", id: "scroll-continuous"},
        ]
    };

    ExternalControls.prototype.setScrollOption = function (option_id) {
        this.readerSettings = cloneUpdate(this.readerSettings, "scroll", option_id);
        TreineticHelpers.updateReader(this.reader, this.readerSettings);
    };

    ExternalControls.prototype.getAvailableDisplayFormats = function () {
        return [
            {name: "Automatic", id: "auto"},
            {name: "Double Page", id: "double"},
            {name: "Single Page", id: "single"},
        ]
    };

    ExternalControls.prototype.setDisplayFormat = function (option_id) {
        this.readerSettings = cloneUpdate(this.readerSettings, "syntheticSpread", option_id);
        TreineticHelpers.updateReader(this.reader, this.readerSettings);
    };

    ExternalControls.prototype.getRecommendedColumnWidthRange = function () {
        return {min: 500, max: 2000}
    };

    ExternalControls.prototype.changeColumnMaxWidth = function (int_size) {
        this.readerSettings = cloneUpdate(this.readerSettings, "columnMaxWidth", int_size);
        TreineticHelpers.updateReader(this.reader, this.readerSettings);
    };

    ExternalControls.prototype.getCurrentReaderSettings = function () {
        return this.readerSettings;
    };


    function func_exists(fname) {
        return (typeof window[fname] === 'function');
    }

    function cloneUpdate(object, attr, value) {
        var newObject = JSON.parse(JSON.stringify(object));
        newObject[attr] = value;
        return newObject;
    }

    return {
        getInstance: function () {
            if (externalcontrols === null) {
                externalcontrols = new ExternalControls();
            }
            return externalcontrols;
        },

        createInstance: function () {
            externalcontrols = new ExternalControls();
        }
    }
});
