var DEVICE_TYPES = {
    ANDROID: "ANDROID",
    IOS: "IOS"
};

var exControls = null;
var events = {};

/**
 * this method is mostely for non mobile devices
 * */
function registerEvent(eventName, func) {
    events[eventName] = func;
}

/**
 * This function get Called from the Reader when an epub file
 * successfully loaded, we can use this to trigger mobile event
 * **/
function onEpubLoadSuccess(externalcontrols) {
    exControls = externalcontrols;
    if (events["onEpubLoadSuccess"]) {
        events["onEpubLoadSuccess"](externalcontrols);
    }
    Log.debug("epub Loaded");
}

/**
 * This function get Called from the Reader when an epub file
 * failed to load, we can use this to trigger mobile event
 * **/
function onEpubLoadFail(error) {
    if (events["onEpubLoadFail"]) {
        events["onEpubLoadFail"](error);
    }
    Log.debug("epub load failed");
}

/**
 * This function get Called from the reader when the epub loaded and
 * then the TOC is loaded, you can check @param hasToc to check
 * whether the epub has TOC or not
 * */
function onTOCLoaded(hasToC) {
    if (events["onTOCLoaded"]) {
        var hasToc = (hasToC && hasToC.length > 0);
        events["onTOCLoaded"](hasToc);
    }
}

/* ----------- RELATED TO PAGES NAVIGATION ----------- */
function nextPage() {
    exControls.nextPage();
}

function prevPage() {
    exControls.prevPage();
}

function hasNextPage() {
    return exControls.hasNextPage();
}

function hasPrevPage() {
    return exControls.hasPrevPage();
}

/* ----------- RELATED TO PAGES NAVIGATION END ----------- */


/*------------ BOOKMARKS ----------------------------------*/
function makeBookmark() {
    return exControls.makeBookMark();
}

//Default is set to auto book mark, and to
function setAutoBookmark($boolean) {
    return exControls.setAutoBookmark($boolean);
}

/*------------ BOOKMARKS END ------------------------------*/


/*--------------- TOC ----------------------------------- */
function getTOCJson() {
    return exControls.getTOCJson();
}

function goToPage(href) {
    exControls.goToPage(href);
}

/*--------------- TOC END-------------------------------- */


/* --------------- SETTINGS ---------------------------*/

function setFontSize(size) {
    exControls.changeFontSize(size);
}

function getRecommendedFontSizeRange() {
    return exControls.getRecommendedFontSizeRange();
}

function getAvailableThemes() {
    return exControls.getAvailableThemes();
}

function setTheme(theme_id) {
    exControls.setTheme(theme_id);
}


function getAvailableScrollModes() {
    return exControls.getAvailableScrollOptions();
}

function setScrollMode(option_id) {
    exControls.setScrollOption(option_id);
}

function getAvailableDisplayFormats() {
    return exControls.getAvailableDisplayFormats();
}

function setDisplayFormat(format_id) {
    exControls.setDisplayFormat(format_id);
}

function changeColumnMaxWidth(size) {
    exControls.changeColumnMaxWidth(size);
}

function getRecommendedColumnMaxWidthRange() {
    return exControls.getRecommendedColumnWidthRange();
}

function getCurrentReaderSettings() {
    return exControls.getCurrentReaderSettings();
}

/* --------------- SETTINGS END ------------------------*/


function Log() {

}

Log.debug = function (debug) {
    console.log(debug);
};





