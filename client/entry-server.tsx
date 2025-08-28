import {renderToString} from "react-dom/server";
import {StrictMode} from "react";
import App from "./App.tsx";

/**
 * @param {string} _url
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function render(_url: string) {
    const html = renderToString(
        <StrictMode>
            <App />
        </StrictMode>,
    )
    return { html }
}