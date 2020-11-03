const { connectToList } = require('ebu-list-sdk');

const run = async () => {
    const list = await connectToList('https://list.ebu.io', 'user', 'pass');
    console.log('Connected');
    await list.getVersion();
    await list.shutdown();
};

run()
    .then(() => {
        console.log('Exiting');
    })
    .catch((e) => {
        console.error(`Error: ${e} ${e.stack}`);
    });
