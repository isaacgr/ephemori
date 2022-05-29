const { UnauthenticatedError, DatabaseError } = require("../../utils/errors");
const { getSessionCommand, deleteSessionTokensCommand } = require("./commands");

class SessionController {
  constructor(db) {
    this.db = db;
  }
}

SessionController.prototype.getSession = async function (sid) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getSessionCommand, [`sess:${sid}`], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      if (res.rows.length === 0) {
        return reject(new UnauthenticatedError("Invalid session id"));
      }
      console.log(`Got session. [${sid}]`);
      resolve(res.rows[0]);
    });
  });
};

SessionController.prototype.deleteSessionTokens = async function () {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(deleteSessionTokensCommand, function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      resolve({
        message: `Deleted session token(s). [${res.rows.length}]`
      });
    });
  });
};

module.exports = SessionController;
