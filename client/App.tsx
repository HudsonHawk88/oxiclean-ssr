import React from "react";
import {AppRoutes} from "./routes/Routes.tsx"
import {toast} from "react-toastify";
import type {IToastType} from "./interfaces/main";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";

const notify = (type: IToastType, msg: string) => {
    toast(msg, { type });
}

function App(): React.ReactElement {

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={typeof window !== 'undefined' ? import.meta.env.VITE_reachaptchaApiKey : undefined}
            language={"hu"}
        >
            <AppRoutes notify={notify} />
        </GoogleReCaptchaProvider>
    );
}

export default App;