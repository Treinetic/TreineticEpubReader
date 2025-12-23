
// State
let activeView = 'standard';

const THEMES = {
    'day': 'default-theme',
    'night': 'night-theme',
    'sepia': 'parchment-theme',
    'navy': 'ballard-theme',
    'author': 'author-theme'
};

$(document).ready(function() {
    console.log("Unified Demo Init");

    // 1. Initialize Reader ONCE in the default container (Desktop)
    var config = TreineticEpubReader.config();
    config.jsLibRoot = "./dist/workers/"; 
    
    // Move reader to desktop container initially
    $('#desktop-container').append($('#unified-reader-instance'));
    
    TreineticEpubReader.create("#epub-reader-frame");
    TreineticEpubReader.open("./dist/sample/assets/epub/epub_1.epub");
    
    var controls = TreineticEpubReader.handler();
    
    controls.registerEvent("onEpubLoadSuccess", function() {
        console.log("EPUB Loaded Successfully");
        // Load TOC
        setTimeout(() => {
            let toc = JSON.parse(controls.getTOCJson());
            renderTOC(toc);
        }, 500);
    });

    // 2. Tab Switching Logic
    $('.tab-btn').on('click', function() {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        
        activeView = $(this).data('target'); // standard, mobile, plain
        
        // Hide all sections
        $('.view-section').removeClass('active');
        $('#' + activeView).addClass('active');

        // MOVE THE READER
        let reader = $('#unified-reader-instance');
        if (activeView === 'standard') {
            $('#desktop-container').append(reader);
            TreineticEpubReader.handler().setTheme(THEMES['day']); // Reset or keep?
        } else if (activeView === 'mobile') {
            $('#mobile-container').append(reader);
        } else if (activeView === 'plain') {
            $('#plain-container').append(reader);
        }
        
        // Force resize/redraw if needed by library (mocking a resize event often helps)
        window.dispatchEvent(new Event('resize'));
    });

});


// --- SHARED CONTROLS ---

function setReaderTheme(key) {
    TreineticEpubReader.handler().setTheme(THEMES[key]);
}

function adjustFont(delta) {
    let el = $('#font-val');
    let val = parseInt(el.text());
    val += delta;
    if (val < 50) val = 50; if (val > 200) val = 200;
    el.text(val + '%');
    TreineticEpubReader.handler().changeFontSize(val);
}

function readerNext() { TreineticEpubReader.handler().nextPage(); }
function readerPrev() { TreineticEpubReader.handler().prevPage(); }

// --- DESKTOP SPECIFIC ---
function toggleDesktopSidebar() {
    $('#desktop-sidebar').toggleClass('visible');
}

let isScroll = false;
function toggleScroll() {
    isScroll = !isScroll;
    TreineticEpubReader.handler().setScrollOption(isScroll ? 'scroll-continuous' : 'auto');
    if (isScroll) $('.nav-btn').hide(); else $('.nav-btn').show();
}

// --- MOBILE SPECIFIC ---
function toggleMobileSheet() {
    $('#mob-sheet').toggleClass('open');
    $('#mob-backdrop').toggleClass('open');
}

function setMobileFrame(device) {
    $('#mobile-device-frame').removeClass('iphone pixel').addClass(device);
}

// --- TOC ---
function renderTOC(tocData) {
    const list = $('#desktop-toc');
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
