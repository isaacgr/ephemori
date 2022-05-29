const { startServer, runDatabase } = require("./server");

(async () => {
  try {
    await runDatabase();
    startServer();
  } catch (e) {
    console.log(`Unable to start server. Error [${e.message}]`);
    process.exit(5);
  }
})();
