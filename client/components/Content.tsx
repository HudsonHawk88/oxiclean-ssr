import React from 'react';
import {Outlet} from "react-router";
import Footer from "./Footer.tsx";

function Content(): React.ReactElement {
    return (
        <>
            <main>
                <Outlet />
                <Footer />
            </main>
        </>
    );
}

export default Content;