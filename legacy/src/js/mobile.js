
// Mobile Reader Implementation

const THEMES = {
    'day': 'default-theme',
    'night': 'night-theme',
    'sepia': 'parchment-theme'
};

$(document).ready(function() {
    console.log("Initializing Mobile Reader...");
    
    var config = TreineticEpubReader.config();
    config.jsLibRoot = "./dist/workers/"; 

    TreineticEpubReader.create("#epub-reader-frame");
    TreineticEpubReader.open("./dist/sample/assets/epub/epub_1.epub");
});

function toggleMobileSheet() {
    $('#mob-sheet').toggleClass('open');
    $('#mob-backdrop').toggleClass('open');
}

function setTheme(key) {
    TreineticEpubReader.handler().setTheme(THEMES[key]);
}

function setFont(val) {
    TreineticEpubReader.handler().changeFontSize(parseInt(val));
}

function setFrame(device) {
    $('#mobile-device-frame').removeClass('iphone pixel').addClass(device);
}
