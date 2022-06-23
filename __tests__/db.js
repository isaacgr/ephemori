const makeDb = require("../server/db");

const database = makeDb({
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

module.exports = {
  db: database.db,
  Database: database.Database,
  createDatabase: database.createDatabase
};
