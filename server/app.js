const loadEnv = require("../loadEnv");
loadEnv();
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);

module.exports = (database) => {
  const app = express();
  const oneHour = 1000 * 3600;
  // session store and session config
  const sessionStore = new pgSession({
    pool: database,
    createTableIfMissing: true
  });

  function ensureSecure(req, res, next) {
    if (req.headers["x-forwarded-proto"] === "https") {
      return next();
    }
    res.redirect("https://" + req.hostname + req.url);
  }

  /**
   * TODO: Handle this properly for development and testing
   */
  if (process.env.NODE_ENV === "production") {
    app.all("*", ensureSecure);
  }

  app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
  app.use(express.static("public"));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      cookie: { maxAge: oneHour },
      resave: false,
      store: sessionStore
    })
  );

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({ errorMessage: err.message });
  });

  // Routes
  app.use("/api/v1", require("./routes/accounts")(database));
  app.use("/api/v1", require("./routes/dates")(database));
  app.use("/api/v1", require("./routes/user")(database));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve("public", "index.html"))
  );
  return { app, sessionStore };
};
