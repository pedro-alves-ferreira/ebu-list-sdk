import { Unwinder } from '@bisect/bisect-core-ts';
import * as apiTypes from './api';
import { AuthClient, ILoginData, IApiHandler, ILocalStorageHandler, IGenericResponse, ILoginResponse } from './auth';
import { Info } from './info';
import { Live } from './live';
import { Pcap } from './pcap';
import { Transport } from './transport';
import { get, post } from './transport/common';
import { RestClient } from './transport/restClient';
import { WSCLient } from './transport/wsClient';
import TokenStorage from './tokenStorage';

// ////////////////////////////////////////////////////////////////////////////

const makeApiHandler = (baseUrl: string): IApiHandler => ({
    login: async (data: ILoginData): Promise<IGenericResponse<ILoginResponse>> =>
        post(baseUrl, null, '/auth/login', data),
    revalidateToken: async (token: string): Promise<IGenericResponse<ILoginResponse>> =>
        get(baseUrl, token, '/api/user/revalidate-token'),
});

export default class LIST {
    private readonly transport: Transport;

    private readonly authClient: AuthClient;

    private readonly rest: RestClient;

    private ws: WSCLient | null = null;

    public constructor(private readonly baseUrl: string) {
        const unwinder = new Unwinder();

        try {
            const apiHandler = makeApiHandler(baseUrl);
            const storage = new TokenStorage();
            this.authClient = new AuthClient(apiHandler, storage);
            unwinder.add(() => this.authClient.close());

            this.rest = new RestClient(baseUrl, this.authClient.getToken.bind(this.authClient));
            this.transport = new Transport(this.rest);

            unwinder.reset();
        } finally {
            unwinder.unwind();
        }
    }

    public async login(username: string, password: string): Promise<void> {
        const loginError = await this.authClient.login(username, password);
        if (loginError) {
            throw loginError;
        }

        const user: apiTypes.user.IUserInfo = (await this.rest.get('/api/user')) as apiTypes.user.IUserInfo;
        this.ws = new WSCLient(this.baseUrl, '/socket', user.id);
    }

    public async close(): Promise<void> {
        if (this.ws) {
            this.ws.close();
        }

        this.authClient.close();
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

    public async logout(): Promise<void> {
        return this.transport.post('/auth/logout', {});
    }
}
