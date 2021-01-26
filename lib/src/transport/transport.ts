import { IPutEntry } from './common';
import { RestClient } from './restClient';

export class Transport {
    public constructor(public readonly rest: RestClient) {}

    public async get(endpoint: string) {
        return this.rest.get(endpoint);
    }

    public async post(endpoint: string, data: object) {
        return this.rest.post(endpoint, data);
    }

    public async putForm(endpoint: string, entries: IPutEntry[]): Promise<any> {
        return this.rest.putForm(endpoint, entries);
    }

    public async del(endpoint: string) {
        return this.rest.del(endpoint);
    }
}
