import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: '.',
    server: {
        port: 3001,
        open: '/demo/index.html' // Open the demo automatically
    },
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/lib/TreineticEpubReader.ts'),
            name: 'TreineticEpubReader',
            fileName: (format) => `treinetic-epub-reader.${format}.js` // e.g. treinetic-epub-reader.umd.js
        },
        rollupOptions: {
            // Externalize deps that shouldn't be bundled
            external: [], // Bundle everything for now to be "standalone"
            output: {
                globals: {}
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
    }
});
