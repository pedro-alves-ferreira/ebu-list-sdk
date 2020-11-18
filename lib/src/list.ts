import * as apiTypes from './api/types';
import { login } from './auth';
import { Info } from './info';
import { Live } from './live';
import { Pcap } from './pcap';
import { Transport } from './transport';
import { RestClient } from './transport/restClient';
import { WSCLient } from './transport/wsClient';
import * as types from './types';

//////////////////////////////////////////////////////////////////////////////

export class LIST {
    // returns a new LIST object
    public static async connectWithOptions(options: types.IListOptions): Promise<LIST> {
        const token = await login(options);

        const rest = new RestClient(options.baseUrl, token);
        const user: apiTypes.IUserInfo = await rest.get('/api/user') as apiTypes.IUserInfo;
        const ws = new WSCLient(options.baseUrl, '/socket', user.id);
        const transport = new Transport(rest, ws);

        return new LIST(transport);
    }

    public static async connect(baseUrl: string, username: string, password: string): Promise<LIST> {
        return LIST.connectWithOptions({ baseUrl, username, password });
    }

    private constructor(public readonly transport: Transport) {
        this.transport = transport;
    }

    public async close(): Promise<void> {
        await this.transport.post('/auth/logout', {});
        this.transport.close();
    }

    public get info() {
        return new Info(this.transport);
    }

    public get live() {
        return new Live(this.transport);
    }

    public get pcap() {
        return new Pcap(this.transport);
    }
}
