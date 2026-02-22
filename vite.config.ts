import { defineConfig } from 'vite';
import viteReact from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [viteReact()],
    ssr: {
        noExternal: ['react-router']
    },
    build: {
        ssr: false,
        rollupOptions: {
            input: './server/index.ts',
        },
    },
    optimizeDeps: { exclude: ["fsevents"] }
});