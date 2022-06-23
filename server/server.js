const loadEnv = require("../loadEnv");
loadEnv();
const makeApp = require("./app");
const TokenService = require("./db/Token");
const SessionService = require("./db/Session");
const makeDb = require("./db");
const fs = require("fs");
const path = require("path");

const { db, Database, createDatabase } = makeDb({
  ssl: {
    require: true,
    rejectUnauthorized: true,
    ca: fs
      .readFileSync(path.resolve(__dirname, "../certs/us-east-1-bundle.pem"))
      .toString()
  }
});

const database = new Database(db);
const tokenService = new TokenService(db);
const sessionService = new SessionService(db);
const port = process.env.PORT || 3100;
const fiveMins = 1000 * 300;

const runDatabase = async () => {
  if (
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "development"
  ) {
    console.log("Creating database...");
    try {
      const result = await createDatabase(process.env.DATABASE_NAME);
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  } else {
    console.log("Not creating database in production server.");
  }
  console.log("Creating database tables...");
  try {
    const result = await database.createTables();
    console.log(result);
  } catch (e) {
    console.log(e);
    process.exit(5);
  }
  console.log("Clearing session tokens...");
  // try {
  //   const res = await sessionService.deleteSessionTokens();
  //   console.log(res.message);
  // } catch (e) {
  //   console.log(e);
  // }
  setInterval(async () => {
    try {
      const res = await tokenService.deleteVerifyTokens();
      console.log(res.message);
    } catch (e) {
      console.log(e);
    }
  }, fiveMins);

  setInterval(async () => {
    try {
      const res = await tokenService.deleteResetTokens();
      console.log(res.message);
    } catch (e) {
      console.log(e);
    }
  }, fiveMins);
};

const { app } = makeApp(db);

const startServer = () =>
  app.listen(port, async () => {
    console.log(`Server started on ${port}`);
  });

module.exports = { startServer, runDatabase };
