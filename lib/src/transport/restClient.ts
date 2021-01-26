import { get, IPutEntry, post, putForm, del, TokenGetter } from './common';

export class RestClient {
    public constructor(private readonly baseUrl: string, private readonly tokenGetter: TokenGetter) {}

    public async get(endpoint: string) {
        return get(this.baseUrl, this.tokenGetter(), endpoint);
    }

    public async post(endpoint: string, data: object) {
        return post(this.baseUrl, this.tokenGetter(), endpoint, data);
    }

    public async postBase(endpoint: string, data: object) {
        return post(this.baseUrl, this.tokenGetter(), endpoint, data);
    }

    public async putForm(endpoint: string, entries: IPutEntry[]): Promise<any> {
        return await putForm(this.baseUrl, this.tokenGetter(), endpoint, entries);
    }

    public async del(endpoint: string) {
        return del(this.baseUrl, this.tokenGetter(), endpoint);
    }
}
