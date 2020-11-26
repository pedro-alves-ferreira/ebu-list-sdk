import { LIST } from '@bisect/ebu-list-sdk';
import { IArgs } from '../../types';

export const run = async (args: IArgs) => {
    console.log(`ARGS: ${JSON.stringify(args)}`);

    if (args.pcapFile === undefined) {
        throw new Error('No pcap file');
    }

    const list = await LIST.connectWithOptions(args);

    const uploadResult = await list.pcap.upload('A pcap file', args.pcapFile);
    const pcapId = uploadResult.uuid;

    console.log(`PCAP ID: ${pcapId}`);

    await list.close();
};
