
// Desktop Reader Implementation

const THEMES = {
    'day': 'default-theme',
    'night': 'night-theme',
    'sepia': 'parchment-theme',
    'navy': 'ballard-theme',
    'author': 'author-theme'
};

$(document).ready(function() {
    console.log("Initializing Desktop Reader...");
    
    // Config
    // FIX: Clear corrupted settings from previous modern reader testing
    try {
        var saved = JSON.parse(localStorage.getItem('reader'));
        if (saved && saved.theme && !saved.theme.includes('-theme')) {
             console.warn("Detected corrupted theme setting, clearing...", saved.theme);
             localStorage.removeItem('reader');
        }
    } catch(e) { localStorage.removeItem('reader'); }
    
    var config = TreineticEpubReader.config();
    config.jsLibRoot = "./dist/workers/"; 

    // Init Reader
    TreineticEpubReader.create("#epub-reader-frame");
    TreineticEpubReader.open("./dist/sample/assets/epub/epub_1.epub");

    // Handlers
    var controls = TreineticEpubReader.handler();

    controls.registerEvent("onEpubLoadSuccess", function() {
        console.log("Book Loaded");
        // Load TOC
        setTimeout(() => {
            let toc = JSON.parse(controls.getTOCJson());
            renderTOC(toc);
        }, 500);
    });
});

// Controls
function toggleSidebar() {
    $('#sidebar').toggleClass('visible');
}

function setTheme(key) {
    console.log("Setting theme:", key);
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

let isScroll = false;
function toggleScroll() {
    isScroll = !isScroll;
    TreineticEpubReader.handler().setScrollOption(isScroll ? 'scroll-continuous' : 'auto');
    if (isScroll) {
        $('.bottom-nav-bar').hide();
    } else {
        $('.bottom-nav-bar').css('display', 'flex');
    }
}

function nextPage() { TreineticEpubReader.handler().nextPage(); }
function prevPage() { TreineticEpubReader.handler().prevPage(); }

// TOC Renderer
function renderTOC(data) {
    const list = $('#toc-list');
    list.empty();
    
    function build(items) {
        let h = '';
        items.forEach(i => {
           h += `<li style="border-bottom:1px solid #eee;">
                    <a href="#" onclick="goTo('${i.Id_link}'); return false;" 
                       style="display:block; padding:12px 15px; color:#333; text-decoration:none; font-size:14px;">
                       ${i.name}
                    </a>`;
           if (i.sub && i.sub.length) {
               h += '<ul style="list-style:none; padding-left:20px;">' + build(i.sub) + '</ul>';
           }
           h +='</li>';
        });
        return h;
    }
    list.append(build(data));
}

window.goTo = function(href) {
    TreineticEpubReader.handler().goToPage(href);
    // Auto close sidebar on selection?
    // toggleSidebar(); 
};
