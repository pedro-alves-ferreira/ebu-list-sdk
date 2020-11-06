import { login, logout } from './auth';
import { get, post } from './common';
import { logger } from './logger';
import { Workflow } from './constants';

//////////////////////////////////////////////////////////////////////////////

declare interface Version {
    major: number,
    minor: number,
    patch: number
};

class LIST {
    private baseUrl: string;
    private token: string;

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    public shutdown() {
        logger.info('Shutting down');
        return logout(this.baseUrl, this.token);
    }

    public async getAllLiveSources() {
        return this.get('/live/sources');
    }

    public async getAllPcaps() {
        return this.get(`/pcap`);
    }

    public async getPcapInfo(pcapId: string) {
        return this.get(`/pcap/${pcapId}`);
    }

    public async getPcapStreams(pcapId: string) {
        return this.get(`/pcap/${pcapId}/streams/`);
    }

    public async getVersion() {
        const version : Version = await this.get('/meta/version') as Version;
        console.log(`LIST version: ${version.major}.${version.minor}.${version.patch}`)
    }

    public async liveCapture(filename: string, duration: number, sources: string[]) {
        const workflow = {
            type: Workflow.liveCapture,
            configuration: {
                durationMs: duration * 1000,
                    filename: filename,
                    ids: sources
            }
        }
        this.sendWorkflow(workflow);
    }

    // PRIVATE
    private async get(endpoint: string) {
        return get(`${this.baseUrl}/api`, this.token, endpoint);
    }

    private async post(endpoint: string, data: object) {
        return post(`${this.baseUrl}/api`, this.token, endpoint, data);
    }

    private async sendWorkflow(workflow: object) {
        return this.post(`/workflow/`, workflow);
    }

}

// returns a new LIST object
export async function connectToList(baseUrl: string, userName: string, password: string): Promise<LIST> {
    const token = await login(baseUrl, userName, password);
    logger.info(`Logged into ${baseUrl}`);

    return new LIST(baseUrl, token);
}
