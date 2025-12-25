/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        environment: 'happy-dom', // Simulates DOM in Node
        globals: true, // Allows describe/it without imports if desired (though I imported them)
    },
});
