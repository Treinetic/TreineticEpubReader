// ModuleConfig.ts
export const ModuleConfig = {
    imagePathPrefix: "",
    epubLibraryPath: "",
    canHandleUrl: false,
    canHandleDirectory: false,
    epubReadingSystemUrl: "/EPUBREADINGSYSTEM.js",
    workerUrl: "/READIUMWORKER.js", // Will need to point to correct workers
    annotationCSSUrl: "/ANNOTATIONS.css",
    mathJaxUrl: "/MATHJAX.js",
    jsLibRoot: "/workers/", // Updated path for workers
    fonts: [],
    useSimpleLoader: false,
    loader: null
};
