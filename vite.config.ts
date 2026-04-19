import { defineConfig } from 'vite';
import viteReact from "@vitejs/plugin-react"
import { resolve } from 'node:path'

export default defineConfig({
    plugins: [viteReact()],
    base: '/',
    ssr: {
        noExternal: ['react-router']
    },
    build: {
        ssr: true,
        rollupOptions: {
            input: {
                main: resolve(import.meta.dirname, 'index.html')
            },
        },
    },
    optimizeDeps: { exclude: ["fsevents"] },
    server: {
        host: "127.0.0.1",
        port: 8080,
    }
});