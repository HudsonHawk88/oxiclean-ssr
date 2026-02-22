import {fetchApi} from "../../helpers/FetchApi.ts";
import type {IFnDone} from "../../interfaces/main";

export function getHello(fnDone: IFnDone) {
// @typescript-eslint/ban-ts-comment
    return fetchApi('http://localhost:3100/api/hello', {
        method: 'GET',
    }, fnDone)
}