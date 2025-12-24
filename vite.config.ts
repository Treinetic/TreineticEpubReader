import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    server: {
        port: 3001
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    }
});
