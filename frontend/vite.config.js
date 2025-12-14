import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
export default defineConfig({
    plugins: [vue()],
    base: '/', // Explicitly set base path for production build
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'esbuild', // Use esbuild (faster and built-in)
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true
            },
            '/sanctum': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true
            }
        }
    }
});
