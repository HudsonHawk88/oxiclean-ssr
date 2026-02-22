import React, {type ReactElement} from "react";
import {Routes, Route} from "react-router";
import Layout from "../Layout.tsx";
import {routeList} from "./RouteList.ts";
import type {IComponentProps} from "../interfaces/main";

export const AppRoutes: (props: IComponentProps) => React.ReactElement = (props): ReactElement => {
    return (
        <Routes>
            <Route path={"/"} element={<Layout {...props} />}>
                {routeList.map(route => {
                    const Component = route.element;
                    return (
                        route.index ?
                            <Route key={route.path} index={route.index} element={<Component {...props} />} /> :
                            <Route key={route.path} path={route.path} element={<Component {...props} />} />
                    )
                })}
            </Route>
        </Routes>
    )
}