
// State
let activeReaderType = 'standard';
let readers = {
    standard: null,
    mobile: null
};

const THEMES = {
    'day': 'default-theme',
    'night': 'night-theme',
    'sepia': 'parchment-theme',
    'navy': 'ballard-theme',
    'author': 'author-theme'
};

const READER_CONTAINER_IDS = {
    standard: '#reader-standard',
    mobile: '#reader-mobile'
};

let currentFontSize = 100;
let currentScrollMode = 'auto';

$(document).ready(function() {
    console.log("Demo v2 initializing...");

    var config = TreineticEpubReader.config();
    config.jsLibRoot = "./dist/workers/"; 
    
    // Init Default
    initReader('standard');

    // Tabs
    $('.tab-btn').on('click', function() {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        
        const target = $(this).data('target'); // 'standard' or 'mobile'
        activeReaderType = target;

        // Toggle sections
        $('section.view-section').hide();
        $('section#' + target).css('display', 'flex');

        if (!readers[target]) {
            initReader(target);
        }
    });

    // Sidebar Toggles
    $('#toggle-sidebar-std').on('click', () => $('#sidebar-std').toggleClass('active'));
    $('#toggle-sidebar-mob').on('click', () => $('#sidebar-mob').toggleClass('active'));
    
    // Validating Font Slider in Mobile
    $('.mobile-font-slider').on('input', function() {
        let val = parseInt($(this).val());
        currentFontSize = val;
        getHandler().changeFontSize(val);
    });
});


function getHandler() {
    return TreineticEpubReader.handler();
}

function initReader(type) {
    const containerId = READER_CONTAINER_IDS[type];
    console.log(`Initializing ${type} in ${containerId}`);
    
    setTimeout(() => {
        TreineticEpubReader.create(containerId);
        TreineticEpubReader.open("./dist/sample/assets/epub/epub_1.epub");
        
        var controls = TreineticEpubReader.handler();
        
        controls.registerEvent("onEpubLoadSuccess", function() {
            readers[type] = true;
            console.log("Loaded " + type);
        });

        controls.registerEvent("onTOCLoaded", function(hasTOC) {
            const rawToc = controls.getTOCJson();
            const tocData = JSON.parse(rawToc);
            const listId = type === 'standard' ? '#toc-list-std' : '#toc-list-mob';
            renderTOC(tocData, listId);
        });
    }, 200);
}


function renderTOC(tocData, listId) {
    const list = $(listId);
    list.empty();

    function createItems(items) {
        let html = '';
        items.forEach(item => {
            html += `<li><a href="#" onclick="navigateTo('${item.Id_link}'); return false;">${item.name}</a>`;
            if (item.sub && item.sub.length > 0) {
                html += '<ul>' + createItems(item.sub) + '</ul>';
            }
            html += '</li>';
        });
        return html;
    }

    if (tocData && tocData.length > 0) {
        list.append(createItems(tocData));
    } else {
        list.append('<li>No TOC available</li>');
    }
}

// Controls
window.navigateTo = function(href) {
    getHandler().goToPage(href);
    // Auto close sidebar on mobile maybe?
    if (activeReaderType === 'mobile') $('#sidebar-mob').removeClass('active');
};

window.applyTheme = function(themeKey) {
    if (THEMES[themeKey]) {
        getHandler().setTheme(THEMES[themeKey]);
    }
};

window.adjustFont = function(delta) {
    currentFontSize += delta;
    if (currentFontSize < 50) currentFontSize = 50;
    if (currentFontSize > 200) currentFontSize = 200;
    
    $('#font-percent').text(currentFontSize + '%');
    getHandler().changeFontSize(currentFontSize);
};

window.toggleScrollMode = function() {
    if (currentScrollMode === 'auto') {
        currentScrollMode = 'scroll-continuous';
        alert("Switched to Continuous Scroll");
    } else {
        currentScrollMode = 'auto';
        alert("Switched to Page Turn");
    }
    getHandler().setScrollOption(currentScrollMode);
};

window.toggleMobileSettings = function() {
    $('#mobile-settings').toggle();
};

window.setMobileSize = function(device) {
    const screen = $('#mobile-screen-emulation');
    if (device === 'iphone6') {
        screen.css({width: '375px', height: '667px'});
    } else if (device === 'pixel') {
        screen.css({width: '411px', height: '731px'});
    }
};
