
// State
let activeInstance = 'desktop';
let readers = {
    desktop: false,
    mobile: false,
    plain: false
};

const THEMES = {
    'day': 'default-theme',
    'night': 'night-theme',
    'sepia': 'parchment-theme',
    'navy': 'ballard-theme',
    'author': 'author-theme'
};

$(document).ready(function() {
    console.log("Demo V3 Init");

    // Config workers
    var config = TreineticEpubReader.config();
    config.jsLibRoot = "./dist/workers/"; 
    
    // Init default
    initReader('desktop');

    // Tab Switching
    $('.tab-btn').on('click', function() {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        
        let target = $(this).data('target');
        activeInstance = target;
        
        $('.view-section').removeClass('active');
        $('#' + (target === 'desktop' ? 'standard' : target)).addClass('active');

        if (!readers[target]) {
            initReader(target);
        }
    });

});

// --- Initialization ---
function initReader(type) {
    let container = '';
    if (type === 'desktop') container = '#reader-desktop';
    if (type === 'mobile') container = '#reader-mobile';
    if (type === 'plain') container = '#reader-plain';
    
    console.log(`Init ${type} in ${container}`);
    
    setTimeout(() => {
        TreineticEpubReader.create(container);
        TreineticEpubReader.open("./dist/sample/assets/epub/epub_1.epub");
        
        let handler = TreineticEpubReader.handler();
        
        handler.registerEvent("onEpubLoadSuccess", function() {
            readers[type] = true;
            console.log(`${type} loaded`);
        });

        if (type === 'desktop') {
            handler.registerEvent("onTOCLoaded", function() {
                let toc = JSON.parse(handler.getTOCJson());
                renderTOC(toc, '#desktop-toc');
            });
        }
    }, 200);
}

// --- DESKTOP CONTROLS ---
function toggleDesktopSidebar() {
    $('#desktop-sidebar').toggleClass('visible');
}

function adjustDesktopFont(delta) {
    let el = $('#desktop-font-val');
    let val = parseInt(el.text());
    val += delta;
    if (val < 50) val = 50; if (val > 200) val = 200;
    el.text(val + '%');
    TreineticEpubReader.handler().changeFontSize(val);
}

function setDesktopTheme(key) {
    TreineticEpubReader.handler().setTheme(THEMES[key]);
}

let isScroll = false;
function toggleScroll() {
    isScroll = !isScroll;
    TreineticEpubReader.handler().setScrollOption(isScroll ? 'scroll-continuous' : 'auto');
    // Hide buttons if scroll?
    if (isScroll) $('.nav-btn').hide(); else $('.nav-btn').show();
}

function readerNext() { TreineticEpubReader.handler().nextPage(); }
function readerPrev() { TreineticEpubReader.handler().prevPage(); }

// --- MOBILE CONTROLS ---
function toggleMobileSheet() {
    $('#mob-sheet').toggleClass('open');
    $('#mob-backdrop').toggleClass('open');
}

function setMobileTheme(key) {
    // Ideally we target specific instance, but singleton limitation:
    // If activeInstance is mobile, handler() controls it.
    TreineticEpubReader.handler().setTheme(THEMES[key]);
}

function setMobileFont(val) {
    TreineticEpubReader.handler().changeFontSize(parseInt(val));
}

function setMobileFrame(device) {
    let frame = $('#mobile-device-frame');
    frame.removeClass('iphone pixel').addClass(device);
}

// --- PLAIN VIEW CONTROLS ---
function plainNext() { TreineticEpubReader.handler().nextPage(); }
function plainPrev() { TreineticEpubReader.handler().prevPage(); }
function setPlainTheme(key) { TreineticEpubReader.handler().setTheme(THEMES[key]); }

function injectPlainCSS() {
    // Advanced: injecting CSS into the iframe
    // We need to find the iframe inside #reader-plain
    let iframe = $('#reader-plain iframe');
    if (iframe.length) {
        let css = `body { color: red !important; } p { font-family: monospace !important; }`;
        iframe.contents().find('head').append(`<style>${css}</style>`);
        alert("Injected CSS: Text should be RED");
    } else {
        alert("Reader iframe not found yet.");
    }
}


// TOC Helper
function renderTOC(tocData, listSelector) {
    const list = $(listSelector);
    list.empty();
    
    function build(items) {
        let h = '';
        items.forEach(i => {
           h += `<li><a href="#" onclick="TreineticEpubReader.handler().goToPage('${i.Id_link}'); return false;">${i.name}</a>`;
           if (i.sub && i.sub.length) h += '<ul>' + build(i.sub) + '</ul>';
           h +='</li>';
        });
        return h;
    }
    list.append(build(tocData));
}
