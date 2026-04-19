import express, {type Express, type Request, type Response} from 'express';
import { createServer } from 'http';
import fs from "node:fs";
import { fileURLToPath } from 'node:url'
import path from "node:path";
import { createServer as createViteServer } from "vite";
import bodyParser from "body-parser";
import cors from 'cors';
import ReChaptchaServices from "./common/ReChaptcha/ReChaptcha.ts";
import EmailServices from "./common/EmailServices/EmailServices.ts";
import KapcsolatServices from "./PublicServices/kapcsolat/KapcsolatServices.tsx";

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const app: Express = express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3100;

const server = createServer(app)

const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
})

app.use(vite.middlewares)
app.use(cors())

const isDev = process.env.NODE_ENV === 'development';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/static', express.static('dist'));

app.get('/api/hello', async (req, res) => {
    console.log(req.url)
    res.status(200).send({ msg: "Hello World" });
})

app.use("/api/mail", EmailServices);
app.use("/api/recaptcha", ReChaptchaServices);
app.use("/api/kapcsolat", KapcsolatServices);

app.get('*all', async (req: Request, res: Response) => {
    const url: string = req.originalUrl;
    try {
        let template = fs.readFileSync(path.resolve(__dirname,
            isDev ? '../index.html' : '../dist/client/index.html'), 'utf8');
        template = await vite.transformIndexHtml(url, template);

        const { render } = isDev ?
            await vite.ssrLoadModule(path.resolve(__dirname, '../client/entry-server.tsx')) :
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await import('../dist/server/entry-server.js');
        const appHtml = await render(url);
        const html = template.replace(`<!--ssr-outlet-->`, () => appHtml.html)
        res.status(200).send(html);
    } catch (error) {
        res.status(500).send(error)
        console.log("SERVER CATCH ERROR: ", error);
    }
});



server.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});