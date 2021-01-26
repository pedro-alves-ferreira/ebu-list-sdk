import { LIST } from '@bisect/ebu-list-sdk';
import { IArgs } from '../../types';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askForNumber = async (question: string): Promise<number> => {
    return new Promise((resolve) => {
        rl.question(question, (answer: string) => {
            resolve(parseInt(answer));
        });
    });
};

const askForConfirmation = async (question: string): Promise<boolean> => {
    return new Promise((resolve) => {
        rl.question(question, (answer: string) => {
            resolve(answer === 'y');
        });
    });
};

const sleep = async (ms: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

export const run = async (args: IArgs) => {
    const list = new LIST(args.baseUrl);
    await list.login(args.username, args.password);

    console.log('---------------------------------');
    console.log('Get live source');
    const sources = await list.live.getAllSources();
    sources.forEach(function(e: any, i: number) {
        console.log(`${i + 1}: ${e.meta.label}: ${JSON.stringify(e.sdp.streams)}`);
    });

    console.log('---------------------------------');
    const index = await askForNumber('Choose source number (defaut 0): ');
    const source = sources[index - 1];
    console.log(`${index}: ${source.meta.label}: ${JSON.stringify(source.sdp.streams)}`);
    console.log('---------------------------------');
    const duration = await askForNumber('Enter capture duration (default 1 seconds): ');
    console.log(`Duration: ${duration * 1000} ms`);

    console.log('---------------------------------');
    const datetime = new Date();
    const filename = `auto-${datetime.toISOString()}-${source.meta.label}`;
    await list.live.startCapture(filename, duration * 1000, [source.id]);
    console.log('Processing');

    var res: any[] = [];
    while (res.length == 0) {
        console.log('.');
        const analysis = await list.pcap.getAll();
        res = analysis.filter((a: any) => a.file_name == filename);
        await sleep(2000);
    }
    console.log('---------------------------------');
    console.log('Pcap:');
    console.log(res[0]);

    console.log('---------------------------------');
    console.log('Streams:');
    console.log(await list.pcap.getStreams(res[0].id));

    console.log('---------------------------------');
    const del = await askForConfirmation('Do you want to delete pcap? [y/n]');
    if (del == true) {
        await list.pcap.del(res[0].id);
    }

    rl.close();
    await list.close();
};

module.exports = { run };
