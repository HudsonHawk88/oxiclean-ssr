import React from "react";
import {AppRoutes} from "./routes/Routes.tsx"
import {toast} from "react-toastify";
import type {IToastType} from "./interfaces/main";

const notify = (type: IToastType, msg: string) => {
    toast(msg, { type });
}

function App(): React.ReactElement {

    return (
        <AppRoutes notify={notify} />
    );
}

export default App;