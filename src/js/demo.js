
// State
let activeReaderType = 'standard';
let readers = {
    standard: null,
    themed: null,
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
    themed: '#reader-themed',
    mobile: '#reader-mobile'
};

$(document).ready(function() {
    console.log("Demo initializing...");

    // Global Config
    var config = TreineticEpubReader.config();
    config.jsLibRoot = "./dist/workers/"; 
    
    // Initialize Standard Reader
    initReader('standard');

    // UI Event Listeners
    setupUIListeners();
});

function setupUIListeners() {
    // Tab Switching
    $('.tab-btn').on('click', function() {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        activeReaderType = $(this).data('target');
        console.log("Switched to tab:", activeReaderType);

        $('.view-section').removeClass('active');
        $('#' + activeReaderType).addClass('active');

        if (!readers[activeReaderType]) {
            initReader(activeReaderType);
        } else {
            // If already initialized, we might need to refresh TOC for this instance if they differ
            // For now, assuming same book, so TOC is same.
        }
    });

    // Sidebar Toggle
    $('#toggle-sidebar').on('click', function() {
        $('#app-sidebar').toggleClass('hidden');
    });

    // Toolbar: Font Size
    $('#font-size-slider').on('change input', function() {
        const val = parseInt($(this).val());
        console.log("Font Size:", val);
        getHandler().changeFontSize(val);
    });

    // Toolbar: Page Width
    $('#page-width-slider').on('change input', function() {
        const val = parseInt($(this).val());
        console.log("Page Width:", val);
        getHandler().changeColumnMaxWidth(val);
    });

    // Toolbar: Theme
    $('#theme-select').on('change', function() {
        const val = $(this).val();
        console.log("Theme:", val);
        getHandler().setTheme(val);
    });

    // Toolbar: Scroll Mode
    $('#scroll-select').on('change', function() {
        const val = $(this).val();
        console.log("Scroll Mode:", val);
        getHandler().setScrollOption(val); // Note: dev-sample.html used setScrollOption
    });
}

function getHandler() {
    // In strict singleton mode, this always returns the handlers for the *currently active* reader instance logic
    // But TreineticEpubReader.handler() returns a singleton instance helper.
    // If the library supports multiple instances, we'd need a specific handler per instance.
    // Based on previous analysis, it wraps Readium.
    return TreineticEpubReader.handler();
}

function initReader(type) {
    const containerId = READER_CONTAINER_IDS[type];
    console.log(`Initializing reader for ${type} in ${containerId}`);
    
    // Small delay to ensure DOM is ready and previous ops cleared
    setTimeout(() => {
        TreineticEpubReader.create(containerId);
        TreineticEpubReader.open("./dist/sample/assets/epub/epub_1.epub");
        
        var controls = TreineticEpubReader.handler();
        
        // Register events
        controls.registerEvent("onEpubLoadSuccess", function() {
            console.log(`EPUB Loaded for ${type}`);
            readers[type] = true;
            populateControls(controls);
        });

        controls.registerEvent("onTOCLoaded", function(hasTOC) {
            console.log("TOC Loaded Event", hasTOC);
            let tocData = [];
            if (hasTOC) {
                // If hasTOC is true, it might pass the data? Or we fetch it.
                // dev-sample.html: if (!hasTOC) { toc = getTOCJson(); }
                // Use getTOCJson regardless if available
                const rawToc = controls.getTOCJson();
                tocData = JSON.parse(rawToc);
            } else {
                const rawToc = controls.getTOCJson();
                tocData = JSON.parse(rawToc);
            }
            renderTOC(tocData);
        });

    }, 200);
}

function populateControls(controls) {
    // Set initial values from reader to controls
    try {
        const settings = controls.getCurrentReaderSettings();
        if (settings) {
            $('#font-size-slider').val(settings.fontSize || 100);
            $('#page-width-slider').val(settings.columnGap || 1000); // map correct prop
            $('#theme-select').val(settings.theme || 'default-theme');
            $('#scroll-select').val(settings.scroll || 'auto');
        }
    } catch(e) {
        console.warn("Could not sync controls", e);
    }
}

function renderTOC(tocData) {
    const list = $('#toc-list');
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

window.navigateTo = function(href) {
    console.log("Navigating to:", href);
    getHandler().goToPage(href);
};

window.applyTheme = function(themeKey) {
    if (THEMES[themeKey]) {
        getHandler().setTheme(THEMES[themeKey]);
    }
};

window.setMobileSize = function(device) {
    const shell = $('#mobile-shell');
    shell.removeClass('mobile-device-iphone6 mobile-device-pixel');
    if (device === 'iphone6') shell.addClass('mobile-device-iphone6');
    if (device === 'pixel') shell.addClass('mobile-device-pixel');
};
