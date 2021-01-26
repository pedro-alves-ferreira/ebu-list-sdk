import { LIST } from '@bisect/ebu-list-sdk';
import { IArgs } from '../../types';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const askForNumber = function (question: string): Promise<number> {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(parseInt(answer));
        })
    })
}

export const run = async (args: IArgs) => {
    const list = new LIST(args.baseUrl);
    await list.login(args.username, args.password);
    const pcaps = await list.pcap.getAll();

    while (true) {
        console.log('------------------\nPcap list:\n------------------');
        pcaps.forEach(function(e: any, i: number) {
            console.log(`${i + 1}: ${JSON.stringify(e.file_name)}`);
        });
        console.log('0: quit');

        var index : number = await askForNumber('Choose a pcap number: ');
        if (index < 0 || index > (pcaps.length + 1))
            continue;
        else if (index == 0)
            break;
        const pcap : any = pcaps[index - 1];
        console.log('Pcap info:');
        console.log(pcap);

        const streams = await list.pcap.getStreams(pcap.id);
        console.log('------------------\nStream list:\n------------------');
        streams.forEach(function(e: any, i: number) {
            console.log(`${i + 1}: ${JSON.stringify(e.media_type)}`);
        });
        console.log('0: quit');

        index = await askForNumber('Choose a stream number: ');
        if (index < 0 || index > (streams.length + 1))
            continue;
        else if (index == 0)
            break;
        const stream : any = streams[index - 1];
        console.log('Stream info:');
        console.log(stream);
    }

    console.log('exit');
    rl.close();
    await list.close();
};
