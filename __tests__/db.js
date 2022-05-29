const makeDb = require("../server/db");

const database = makeDb("lifegrid");

module.exports = {
  db: database.db,
  Database: database.Database,
  createDatabase: database.createDatabase
};
