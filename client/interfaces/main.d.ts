import { JSX } from "react";

export interface RoutListProps { path: string, index: boolean, element: JSX.ElementType, text: string, linkable: boolean }
export interface IResult { msg?: string; data?: never }
export type IFnDone = (err: Error | null, res: IResult) => void;
export interface rechaptchaResult extends IResult{ success: boolean };
export type IToastType = 'success' | 'info' | 'warning' | 'error';
export type INotify = (type: IToastType, msg: string) => void;
export interface IComponentProps { notify: INotify, [key: string]: never }