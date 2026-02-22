import type {IFnDone, IResult} from "../interfaces/main";
const jsonContentType = "application/json";

async function handleResult(response: Response, fnDone: IFnDone) {
    const contentType = response.headers.get("content-type")
    const result: IResult = { data: contentType ? (contentType.includes(jsonContentType) ?
                await response.json() :
                await response.text()
        ) : null };
    if (response.status === 200) {
        fnDone(null, result)
    } else {
        const err = new Error(response.statusText);
        const errData: IResult = Object.assign(result, { msg: `${response.status} - ${response.statusText}` });
        console.log("errData: ", errData);
        fnDone(err, errData);
    }
}

export async function fetchApi(
    url: URL | string,
    fetchOpts: RequestInit = {method: 'GET', headers: { 'Content-Type': jsonContentType }},
    fnDone: IFnDone
): Promise<void> {
    return await fetch(url, fetchOpts).then((response) => handleResult(response, fnDone));
}