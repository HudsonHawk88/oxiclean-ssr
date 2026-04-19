import express, {type Express} from 'express';
import { createServer } from 'http';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url'
import path from "node:path";
import {createServer as createViteServer, type ViteDevServer} from "vite";
import bodyParser from "body-parser";
import cors from 'cors';
import ReChaptchaServices from "./common/ReChaptcha/ReChaptcha.ts";
import EmailServices from "./common/EmailServices/EmailServices.ts";
// import KapcsolatServices from "./PublicServices/kapcsolat/KapcsolatServices.ts";

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const app: Express = express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3100;
const isProd = process.env.NODE_ENV === 'production';
const base = process.env.BASE || '/';

const server = createServer(app)
let vite: ViteDevServer | null = null;

if (!isProd) {
    // 1. FEJLESZTŐI MÓD: Vite middleware használata
    vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base
    });
    app.use(vite.middlewares);
} else {
    // 2. PRODUKCIÓS MÓD: Statikus fájlok kiszolgálása a dist/client mappából
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;
    app.use(compression());
    app.use(base, sirv('./dist/client', { extensions: [] }));
}

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/static', express.static('dist/client'));

app.get('/api/hello', async (req, res) => {
    console.log(req.url)
    res.status(200).send({ msg: "Hello World" });
})

app.use("/api/mail", EmailServices);
app.use("/api/recaptcha", ReChaptchaServices);
// app.use("/api/kapcsolat", KapcsolatServices);

app.use('*all', async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '');
        let template;
        let render;

        if (!isProd && vite) {
            // Fejlesztéskor az index.html-t a gyökérből olvassuk és a Vite alakítja át
            template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
            template = await vite.transformIndexHtml(url, template);
            render = (await vite.ssrLoadModule('/client/entry-server.tsx')).render;
        } else {
            // Produkcióban a már lefordított (dist) fájlokat használjuk
            template = await fs.readFile(path.resolve(__dirname, 'client/index.html'), 'utf-8');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            render = (await import('./server/entry-server.js')).render;
        }

        // Az app specifikus renderelése (pl. React vagy Vue)
        const rendered = await render(url);

        // Beillesztjük a generált HTML-t a sablonba
        const html = template
            .replace(`<!--ssr-outlet-->`, rendered.html ?? '')
            .replace(`<!--head-outlet-->`, rendered.head ?? '');

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
    } catch (e: Error) {
        vite?.ssrFixStacktrace(<Error>e);
        console.log(e.stack);
        res.status(500).end(e.stack);
    }
});




server.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});