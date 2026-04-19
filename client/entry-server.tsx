import React from "react"
import {renderToString} from "react-dom/server";
import App from "./App.tsx";
import {StaticRouter} from "react-router";
import {ToastContainer} from "react-toastify";

export function render(url: string) {
    const html = renderToString(
        <React.StrictMode>
            <StaticRouter location={url}>
                <ToastContainer />
                <App />
            </StaticRouter>
        </React.StrictMode>,
    )
    return { html }
}