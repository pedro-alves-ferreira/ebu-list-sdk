import http from 'http';
import https from 'https';
import { StringDecoder } from 'string_decoder';

//////////////////////////////////////////////////////////////////////////////

declare type resolver = (value?: any | PromiseLike<any>) => void;
declare type rejector = (reason?: any) => void;
declare type promiseExecutor = (resolve: (value?: object | PromiseLike<object>) => void, reject: (reason?: any) => void) => void;

interface IRequestOptionsExt extends http.RequestOptions {
    rejectUnauthorized?: boolean;
}

const makeRequest = (u: string, options: http.RequestOptions, callback: (res: http.IncomingMessage) => void): http.ClientRequest => {
    if (u.startsWith('https')) {
        return https.request(u, options, callback);
    }

    return http.request(u, options, callback);
};

const handleHttpResponse = (res: http.IncomingMessage, resolve: resolver, reject: rejector): void => {
    let body: string = '';
    const decoder: StringDecoder = new StringDecoder('utf8');
    res.on('data', (data: Buffer) => body += decoder.write(data));
    res.on('end', () => {
        try {
            resolve(JSON.parse(body));
        } catch (err) {
            reject(err);
        }
    });
    res.on('error', reject);
}

export async function post(baseUrl: string, authToken: string | null, endpoint: string, data: object): Promise<any> {
    const payload: string = JSON.stringify(data);

    const headers: http.OutgoingHttpHeaders = {
        'Content-Length': Buffer.byteLength(payload),
        'Content-Type': 'application/json;charset=UTF-8',
    };

    if (authToken !== null) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const options: IRequestOptionsExt = {
        headers,
        method: 'POST',
        rejectUnauthorized: false,
    };

    return new Promise((resolve, reject): void => {
        const callback = (res: http.IncomingMessage): void => handleHttpResponse(res, resolve, reject);
        const req: http.ClientRequest = makeRequest(`${baseUrl}${endpoint}`, options, callback);
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

export async function get(baseUrl: string, authToken: string, endpoint: string) {
    const headers: http.OutgoingHttpHeaders = {
        Authorization: `Bearer ${authToken}`,
    };

    const options = {
        headers,
        method: 'GET',
        rejectUnauthorized: false,
    };

    return new Promise((resolve, reject): void => {
        const callback = (res: http.IncomingMessage): void => handleHttpResponse(res, resolve, reject);
        const req: http.ClientRequest = makeRequest(`${baseUrl}${endpoint}`, options, callback);
        req.on('error', reject);
        req.end();
    });
}

declare interface IResponseBase {
    result: number,
    success: boolean,
};

function isResponse(object: any): object is IResponseBase {
    return (('result' in object) || ('success' in object));
}

export const validateResponseCode = (res: any) => {
    if (!res) { throw new Error(`Failed: ${JSON.stringify(res)}`); }

    if (!isResponse(res)) {
        throw new Error(`Failed: ${JSON.stringify(res)}`);
    }

    const r: IResponseBase = res as IResponseBase;

    if ((r.result !== 0) && r.success !== true) {
        throw new Error(`Failed: ${JSON.stringify(res)}`);
    }
};
