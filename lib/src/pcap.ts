import { Transport } from './transport';
import { IPcapUploadResult } from './types';
import { IPcapInfo, IStreamInfo } from './api/pcap';

// ////////////////////////////////////////////////////////////////////////////

export default class Pcap {
    public constructor(private readonly transport: Transport) {
        this.transport = transport;
    }

    public async getAll(): Promise<IPcapInfo[]> {
        const response = await this.transport.get('/api/pcap');
        const pcaps: IPcapInfo[] = response as IPcapInfo[];
        return pcaps;
    }

    public async getInfo(pcapId: string): Promise<IPcapInfo> {
        return this.transport.get(`/api/pcap/${pcapId}`);
    }

    public async del(pcapId: string): Promise<void> {
        await this.transport.del(`/api/pcap/${pcapId}`);
    }

    public async getStreams(pcapId: string): Promise<IStreamInfo[]> {
        const response = await this.transport.get(`/api/pcap/${pcapId}/streams/`);
        const streams: IStreamInfo[] = response as IStreamInfo[];
        return streams;
    }

    // name: the name that will show up on LIST
    // stream: e.g. fs.createReadStream(path)
    public async upload(name: string, stream: any): Promise<IPcapUploadResult> {
        const result = await this.transport.putForm('/api/pcap', [
            { name: 'pcap', value: stream },
            { name: 'originalFilename', value: name },
        ]);
        return result as IPcapUploadResult;
    }
}
