import { fetchApi } from '../../helpers/FetchApi.ts';
import type {IFnDone, IResult, rechaptchaResult} from "../../interfaces/main";
const location: { origin?: string } = typeof window !== 'undefined' ? window.location : {};
const kapcsolatUrl = location.origin + '/api/kapcsolat';
const sendEmailUrl = location.origin + '/api/mail/sendfromcontact';
const rechaptchaUrl = location.origin + '/api/recaptcha';

export function listElerhetosegek(fnDone: IFnDone) {
    return fetchApi(
        kapcsolatUrl,
        {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            }
        },
        fnDone
    );
}

export function sendEmail(emailObj: unknown, fnDone: IFnDone) {
    return  fetchApi(
        sendEmailUrl,
        {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://192.168.11.64:3000'
            },
            body: JSON.stringify(emailObj)
        },
        fnDone
    );
}

export function checkRechaptcha(
    token: string,
    fnDone: (err: Error | null, res: rechaptchaResult | IResult) => void) {
    return fetchApi(
        rechaptchaUrl,
        {
            method: 'POST',
            mode: 'cors',
            // cache: "no-cache",
            headers: {
                gtoken: token
            }
        },
        fnDone
    );
}

