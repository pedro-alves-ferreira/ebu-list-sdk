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
    const list = await LIST.connectWithOptions(args);
    const pcaps = await list.pcap.getAll();

    while (true) {
        pcaps.forEach(function(e: any, i: number) {
            console.log(`${i + 1}: ${JSON.stringify(e.file_name)}`);
        });
        console.log('0: quit');

        const index : number = await askForNumber('Choose a pcap number: ');
        if (index > (pcaps.length + 1))
            continue;
        else if (index == 0)
            break;
        const pcap : any = pcaps[index - 1];
        console.log(pcap);
    }

    console.log('exit');
    await list.close();
};
