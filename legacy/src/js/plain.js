
// Plain Reader Implementation

const THEMES = {
    'day': 'default-theme',
    'night': 'night-theme'
};

$(document).ready(function() {
    console.log("Initializing Plain Reader...");
    
    var config = TreineticEpubReader.config();
    config.jsLibRoot = "./dist/workers/"; 

    TreineticEpubReader.create("#epub-reader-frame");
    TreineticEpubReader.open("./dist/sample/assets/epub/epub_1.epub");
});

function nextPage() { TreineticEpubReader.handler().nextPage(); }
function prevPage() { TreineticEpubReader.handler().prevPage(); }

function setTheme(key) {
    TreineticEpubReader.handler().setTheme(THEMES[key]);
}

function injectCSS() {
    let iframe = $('#epub-reader-frame iframe');
    if (iframe.length) {
        let css = `body, p, div, span { color: red !important; }`;
        iframe.contents().find('head').append(`<style>${css}</style>`);
        alert("Injected CSS: Text should be RED");
    } else {
        alert("Reader not ready");
    }
}
