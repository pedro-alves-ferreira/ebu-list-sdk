/*
 * This script:
 * 1) gets available live sources
 * 2) asks the user to choose one of them
 * 3) asks the user the capture duration
 * 4) starts a capture and ingest
 * 5) displays analysis result
 */

const { LIST } = require('@bisect/ebu-list-sdk');
const readline = require('readline');
import { IArgs } from '../../types';

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

const sleep = async (ms: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

export const run = async (args: IArgs) => {
    const list = await LIST.connect('http://localhost', 'user', 'pass');

    console.log('---------------------------------');
    console.log('Get live source');
    const sources = await list.live.getAllSources();
    sources.forEach(function(e: any, i: any) {
        console.log(`${i}: ${e.meta.label}: ${JSON.stringify(e.sdp.streams)}`);
    });

    console.log('---------------------------------');
    const index = await askForNumber('Choose source number (defaut 0): ');
    const source = sources[index];
    console.log(`${index}: ${source.meta.label}: ${JSON.stringify(source.sdp.streams)}`);
    console.log('---------------------------------');
    const duration = await askForNumber('Enter capture duration (default 1 seconds): ');
    console.log(`Duration: ${duration * 1000} ms`);
    rl.close();

    console.log('---------------------------------');
    const datetime = new Date();
    const filename = `auto-${datetime.toISOString()}-${source.meta.label}`;
    await list.live.startCapture(filename, duration * 1000, [source.id]);

    var res = [];
    while (res.length == 0) {
        console.log('.');
        const analysis = await list.pcap.getAll();
        res = analysis.filter((a: any) => a.file_name == filename);
        await sleep(2000);
    }
    console.log('---------------------------------');
    console.log('pcap:');
    console.log(res[0]);

    console.log('---------------------------------');
    console.log('streams:');
    console.log(await list.pcap.getStreams(res[0].id));

    await list.close();
};

module.exports = { run };
