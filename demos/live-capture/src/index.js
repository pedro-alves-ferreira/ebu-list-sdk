/*
 *
 * This script:
 * 1) gets available live sources
 * 2) asks the user to choose one of them
 * 3) asks the user the capture duration
 * 4) starts a capture and ingest
 * 5) displays analysis result
 *
 */

const { connectToList } = require('ebu-list-sdk');
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const askForNumber = (question,r) => {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            userInput = parseInt(answer);
            resolve(parseInt(answer));
        })
    })
}

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const run = async () => {
    const list = await connectToList('http://localhost', 'user', 'pass');

    console.log("---------------------------------");
    console.log("Get live source");
    const sources = await list.getAllLiveSources();
    sources.forEach(function(e, i) {
        console.log(`${i}: ${e.meta.label}: ${JSON.stringify(e.sdp.streams)}`);
    });

    console.log("---------------------------------");
    const index = await askForNumber('Choose source number (defaut 0): ');
    source = sources[index];
    console.log(`${index}: ${source.meta.label}: ${JSON.stringify(source.sdp.streams)}`);
    console.log("---------------------------------");
    const duration = await askForNumber('Enter capture duration (default 1 seconds): ');
    console.log(`Duration: ${duration * 1000} ms`)
    rl.close();

    console.log("---------------------------------");
    const datetime = new Date();
    const filename = `auto-${datetime.toISOString()}-${source.meta.label}`;
    await list.liveCapture(filename, duration, [ source.id ]);

    var res = [];
    while (res.length == 0) {
        console.log(".");
        const analysis = await list.getAllPcaps();
        res = analysis.filter(a => a.file_name == filename);
        await sleep(2000);
    }
    console.log("---------------------------------");
    console.log("pcap:");
    console.log(res[0]);

    console.log("---------------------------------");
    console.log("streams:");
    console.log(await list.getPcapStreams(res[0].id));

    await list.shutdown();
};

run()
    .then(() => {
        console.log('Exiting');
    })
    .catch((e) => {
        console.error(`Error: ${e} ${e.stack}`);
    });
