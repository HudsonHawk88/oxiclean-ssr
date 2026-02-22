import React from "react";
import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {ToastContainer} from "react-toastify";

hydrateRoot(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    document.getElementById('root'),
    <React.StrictMode>
        <BrowserRouter>
            <ToastContainer />
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)