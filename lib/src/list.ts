import { login } from './auth';
import { get } from './common';
import { logger } from './logger';

//////////////////////////////////////////////////////////////////////////////

class LIST {
    private baseUrl: string;
    private token: string;

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    public shutdown() {
        logger.info('Shutting down');
    }

    public async getPcapInfo(pcapId: string) {
        return this.get(`/pcap/${pcapId}`);
    }

    public async getPcapStreams(pcapId: string) {
        return this.get(`/pcap/${pcapId}/streams/`);
    }

    // PRIVATE
    private async get(endpoint: string) {
        return get(`${this.baseUrl}/api`, this.token, endpoint);
    }
}

// returns a new LIST object
export async function connectToList(baseUrl: string, userName: string, password: string): Promise<LIST> {
    const token = await login(baseUrl, userName, password);
    logger.info(`Logged into ${baseUrl}`);

    return new LIST(baseUrl, token);
}
