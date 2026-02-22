import React from 'react';
import Header from "./components/Header.tsx";
import Content from "./components/Content.tsx";

function Layout(props: any): React.ReactElement {
    return (
        <>
            <Header {...props} />
            <Content {...props} />
        </>
    );
}

export default Layout;