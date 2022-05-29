const loadEnv = require("../../loadEnv");
loadEnv();
const pg = require("pg");
(function (pg) {
  function camelCaser(snake) {
    var tokens = snake.split(/_+/).filter(function (token) {
      return token.length;
    });
    return tokens.length
      ? tokens
          .shift()
          .toLowerCase()
          .concat(
            tokens
              .map(function (token) {
                return token.charAt(0).toUpperCase().concat(token.substring(1));
              })
              .join("")
          )
      : snake;
  }

  var queryProto = pg.Query.prototype;
  var orgHandleRowDescription = queryProto.handleRowDescription;
  queryProto.handleRowDescription = function (msg) {
    msg.fields.forEach(function (field) {
      field.name = camelCaser(field.name);
    });
    return orgHandleRowDescription.call(this, msg);
  };
})(pg);

const { Pool, Client } = require("pg");

module.exports = (applicationDatabaseName) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false // This line will fix new error
    }
  });

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    throw new Error(err.message);
  });

  class Database {
    constructor(database) {
      this.db = database;
    }
  }

  Database.prototype.dropTables = async function () {
    var _this = this;
    return new Promise(async (resolve, reject) => {
      try {
        await _this.db.query(
          `DROP TABLE IF EXISTS users, verification_tokens, reset_tokens, important_dates`
        );
        resolve("Tables dropped.");
      } catch (e) {
        reject(e);
      }
    });
  };

  const createDatabase = async function () {
    return new Promise(async (resolve, reject) => {
      const client = new Client({
        connectionString: process.env.CREATE_DATABASE_URL
      });
      client.connect();
      // There is no CREATE DATABASE IF NOT EXISTS in postgres, which is decidedly annoying
      // instead, we have to query and see if the database and user exists, and if not, create them
      try {
        const dbQuery = await client.query(
          `SELECT FROM pg_database WHERE datname = $1`,
          [applicationDatabaseName]
        );
        if (dbQuery.rows.length === 0) {
          // database does not exist, make it:
          await client.query(`CREATE DATABASE ${applicationDatabaseName}`);
          return resolve("Database created.");
        }

        resolve("Database already exists.");
      } catch (e) {
        reject(e);
      } finally {
        client.end();
      }
    });
  };

  Database.prototype.createTables = async function () {
    var _this = this;
    return new Promise(async (resolve, reject) => {
      try {
        await _this.db.query(
          `CREATE TABLE IF NOT EXISTS users(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            display_name TEXT,
            date_of_birth TEXT,
            is_user_set BOOLEAN DEFAULT false NOT NULL CHECK (is_user_set IN (false, true)),
            verified BOOLEAN DEFAULT false NOT NULL CHECK (verified IN (false, true)),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            )`
        );
        await _this.db.query(
          `CREATE TABLE IF NOT EXISTS verification_tokens(
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            user_id UUID,
            token TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id)
          )`
        );
        await _this.db.query(
          `CREATE TABLE IF NOT EXISTS reset_tokens(
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            user_id UUID,
            token TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id)
          )`
        );
        await _this.db.query(
          `CREATE TABLE IF NOT EXISTS important_dates(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID,
            date TEXT NOT NULL,
            color TEXT NOT NULL,
            significance TEXT,
            CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id)
            )`
        );
        await _this.db.query(
          `
          DROP TABLE IF EXISTS session
          `
        );
        await _this.db.query(
          `
          CREATE TABLE IF NOT EXISTS "session" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
          )
          WITH (OIDS=FALSE);

          ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

          CREATE INDEX "IDX_session_expire" ON "session" ("expire");
          `
        );
        resolve("All tables created.");
      } catch (err) {
        return reject(new Error(err.message));
      }
    });
  };
  return { db: pool, Database, createDatabase };
};
