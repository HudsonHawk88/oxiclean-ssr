import React from 'react';
import {NavLink, useLocation} from "react-router";
import {routeList} from "../routes/RouteList.ts";

function Header(): React.ReactElement {
    const location = useLocation();

    function isActiveNav(path: string): boolean {
        return location.pathname === path;
    }

    return (
        <header>
            <div className={"brand"} />
            <nav className={"navigation"}>
                {routeList.map((route, idx ) => (
                    route.linkable &&
                        <li key={idx.toString()} className={isActiveNav(route.path) ? 'active' : ''}><NavLink to={route.path}>{route.text}</NavLink></li>
                ))}
            </nav>
        </header>
    );
}

export default Header;