import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { routeList } from "../routes/RouteList.ts";

function Header(): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navigateTo = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <header className="header">
            {/* A logó és a hambi egy sorban marad */}
            <Link to="/" className="brand" onClick={() => setIsOpen(false)}>OxiClean</Link>

            <button
                className={`hamburger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            {/* A navigation a wrap miatt mobilnézetben alá fog ugrani */}
            <nav className={`navigation ${isOpen ? 'open' : ''}`}>
                <ul className="nav-links">
                    {routeList.map((route, idx) => (
                        route.linkable && (
                            <li
                                key={idx}
                                className={location.pathname === route.path ? 'active' : ''}
                                onClick={() => navigateTo(route.path)}
                            >
                                <NavLink to={route.path}>{route.text}</NavLink>
                            </li>
                        )
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Header;