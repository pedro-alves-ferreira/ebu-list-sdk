import { Transport } from './transport';
import * as types from './types';

//////////////////////////////////////////////////////////////////////////////

export class Info {
    public constructor(private readonly transport: Transport) {
        this.transport = transport;
    }

    public async getVersion() {
        const response = await this.transport.get('/api/meta/version');
        const version: types.IVersion = response as types.IVersion;
        return version;
    }
}
