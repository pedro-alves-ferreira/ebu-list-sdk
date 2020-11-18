import { LIST, api } from '@bisect/ebu-list-sdk';

const pcapFile = 'sample.pcap';

const run = async () => {
    const list = await LIST.connect('https://list.ebu.io', 'user', 'pass');
    console.log('Connected');

    const callback = (message: any) => {
        // console.log(JSON.stringify(message));
        // if (api.wsEvents.isPcapReceivedEvent(message)) {
        //     console.log(`Received: ${message.data.id}`);
        // } else if (api.wsEvents.isPcapPreProcessedEvent(message)) {
        //     console.log(`Pre-processed. ${JSON.stringify(message.data)}`);
        // } else if (api.wsEvents.isPcapProcessingDoneEvent(message)) {
        //     console.log(`Done. Errors: ${message.data.summary.error_list.length}`);
        // }
    };

    // list.transport.ws.client.on('message', callback);

    const uploadResult = await list.pcap.upload('A pcap file', pcapFile);
    const pcapId = uploadResult.uuid;

    console.log(`PCAP ID: ${pcapId}`);

    await list.close();
};

console.log('pcap-upload');
run()
    .then(() => {
        console.log('Exiting');
    })
    .catch(e => {
        console.error(`Error: ${e} ${e.stack}`);
    });
