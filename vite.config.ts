import { defineConfig } from 'vite';
import viteReact from "@vitejs/plugin-react"


export default defineConfig(({ isSsrBuild }) => ({
    plugins: [viteReact()],
    ssr: {
        noExternal: ['react-router']
    },
    build: {
        outDir: isSsrBuild ? 'dist/server' : 'dist/client',
        rollupOptions: {
            // Csak SSR build esetén adjuk meg a szerver oldali belépőt
            input: isSsrBuild ? 'client/entry-server.tsx' : 'index.html'
        }
    },
    optimizeDeps: { exclude: ["fsevents"] },
    server: {
        host: "127.0.0.1",
        port: 3001,
    }
}));