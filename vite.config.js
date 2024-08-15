import { defineConfig } from 'vite';
import { resolve } from 'path';

// vite.config.js
export default defineConfig({
    // config options
    root: resolve(__dirname, 'src'), 
    resolve: {
        alias: {
            '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
            'images': resolve(__dirname, 'public/images'),
            'icons': resolve(__dirname, 'public/icons'),
        }
    },
    server: {
        port: 8080,
        hot: true
    },
    base: "/movie"   
});
