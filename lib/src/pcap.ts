import fs from 'fs';
import { Transport } from './transport';
import { IPcapUploadResult, PcapId, IPcapInfo } from './types';

//////////////////////////////////////////////////////////////////////////////

export class Pcap {
    public constructor(private readonly transport: Transport) {
        this.transport = transport;
    }

    public async getAll() {
        const response = await this.transport.get('/api/pcap');
        const pcaps: IPcapInfo[] = response as IPcapInfo[];
        return pcaps;
    }

    public async getInfo(pcapId: string) {
        return this.transport.get(`/api/pcap/${pcapId}`);
    }

    public async getStreams(pcapId: string) {
        return this.transport.get(`/api/pcap/${pcapId}/streams/`);
    }

    // path: actual path to the file
    // name: the name that will show up on LIST
    public async upload(name: string, path: string): Promise<IPcapUploadResult> {
        const result = await this.transport.putForm('/api/pcap', [
            { name: 'pcap', value: fs.createReadStream(path) },
            { name: 'originalFilename', value: name },
        ]);
        return result as IPcapUploadResult;
    }

    // public makeAnalysisAwaiter(pcapId: PcapId, timeoutMs: number): Promise<any> {
    //     console.log('makeAnalysisAwaiter');
    //     return this.transport.ws.makeAwaiter<object>(
    //         'batatas',
    //         (data: any) => {
    //             return false;
    //         },
    //         timeoutMs
    //     );
    // }
}
