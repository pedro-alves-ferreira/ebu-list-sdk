import { Transport } from './transport';
import * as types from './types';

//////////////////////////////////////////////////////////////////////////////

export class Info {
    public constructor(private readonly transport: Transport) {
        this.transport = transport;
    }

    public async getVersion() {
        const version: types.IVersion = (await this.transport.get('/api/meta/version')) as types.IVersion;
    }
}
