# Legacy Build Instructions

This project was originally built using Grunt and RequireJS. While the modern version uses pre-built artifacts in `dist/`, you can still rebuild the core if needed.

## Prerequisites
- Node.js (Legacy version might be required, e.g., Node 10/12)
- Grunt CLI

## Rebuilding Core
1.  Navigate to `readium-js` folder (now part of the repo).
2.  Install dependencies there: `npm install`.
3.  Run the build scripts defined in `readium-js/package.json`.

**Note:** The modern `package.json` in the root does NOT include Grunt to keep the project lightweight. You must install grunt tools manually if you wish to run the legacy build.
