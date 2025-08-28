import express, {type Express, type NextFunction, type Request, type Response} from 'express';
import fs from "node:fs";
import { fileURLToPath } from 'node:url'
import {createServer as createViteServer, type ViteDevServer} from 'vite'
import path from "node:path";

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const app: Express = express();
const vite: ViteDevServer = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
})
app.use(vite.middlewares);

app.use('/static', express.static('dist'));

app.get('*all', async (req: Request, res: Response, next: NextFunction) => {
    const url: string = req.originalUrl;

    try {

        let template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

        template = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule(path.resolve(__dirname, '../client/entry-server.tsx'));
        const appHtml = await render(url);
        const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)

        res.status(200).send(html);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    } catch (error: Error) {
        vite.ssrFixStacktrace(error);
        next(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});