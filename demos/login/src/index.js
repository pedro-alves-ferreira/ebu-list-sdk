const { connectToList } = require("ebu-list-sdk");

const run = async () => {
  try {
    const list = await connectToList('http://localhost:8080', 'admin', 'admin');
    console.log("hello");
    } catch(e) {
      console.error(`Error: ${e} ${e.stack}`);
    }
};

run()
  .then(() => {
    console.log("Exiting");
  })
  .catch((e) => {
    console.error(`Error: ${e} ${e.stack}`);
  });
