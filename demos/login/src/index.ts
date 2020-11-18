import { LIST } from '@bisect/ebu-list-sdk';

const run = async () => {
    const list = await LIST.connect('https://list.ebu.io', 'user', 'pass');
    console.log('Connected');
    const version = await list.info.getVersion();
    console.log(JSON.stringify(version));
    await list.close();
};

run()
    .then(() => {
        console.log('Exiting');
    })
    .catch(e => {
        console.error(`Error: ${e} ${e.stack}`);
    });
