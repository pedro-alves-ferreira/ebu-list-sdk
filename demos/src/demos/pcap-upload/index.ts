import { LIST } from '@bisect/ebu-list-sdk';
import { IArgs } from '../../types';
import fs from 'fs';

export const run = async (args: IArgs) => {
    if (!args._ || args._.length < 2) {
        throw new Error('No pcap file');
    }

    const pcapFile = args._[1];

    const list = new LIST(args.baseUrl);
    await list.login(args.username, args.password);

    const stream = fs.createReadStream(pcapFile);

    const uploadResult = await list.pcap.upload('A pcap file', stream);
    const pcapId = uploadResult.uuid;

    console.log(`PCAP ID: ${pcapId}`);

    await list.close();
};
