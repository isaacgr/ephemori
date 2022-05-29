const { DatabaseError, InvalidTokenError } = require("../../utils/errors");
const generateToken = require("../../utils/generateToken");

const {
  createVerifyTokenCommand,
  getVerifyTokenForUserCommand,
  createResetTokenCommand,
  getResetTokenForUserCommand,
  getResetTokenCommand,
  deleteVerifyTokensCommand,
  deleteResetTokensCommand,
  deleteResetTokenCommand,
  deleteVerifyTokenCommand
} = require("./commands");

class TokenController {
  constructor(db) {
    this.db = db;
    this.EMAIL_TOKEN_LENGTH = 40;
    this.RESET_TOKEN_LENGTH = 45;
  }
}

TokenController.prototype.generateToken = async function ({
  userId,
  command,
  length
}) {
  const _this = this;
  return new Promise((resolve, reject) => {
    const token = generateToken(length);
    _this.db.query(command, [token, userId], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      /**
       * TODO: Handle empty rows
       */
      console.log(`Token generated for user. [${userId}].`);
      resolve(res.rows[0].token);
    });
  });
};

TokenController.prototype.createVerifyToken = async function (userId) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getVerifyTokenForUserCommand, [userId], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      if (res.rows.length === 0) {
        const token = _this.generateToken({
          userId,
          command: createVerifyTokenCommand,
          length: _this.EMAIL_TOKEN_LENGTH
        });
        return resolve(token);
      } else if (res.rows[0].token) {
        if (
          new Date() >=
          new Date(
            new Date(res.rows[0].createdAt).setDate(
              new Date(res.rows[0].createdAt).getDate() + 1
            )
          )
        ) {
          const token = _this.generateToken({
            userId,
            command: createVerifyTokenCommand,
            length: _this.EMAIL_TOKEN_LENGTH
          });
          return resolve(token);
        }
        resolve(res.rows[0].token);
      } else {
        return reject(new DatabaseError("Unknown error generating token."));
      }
    });
  });
};

TokenController.prototype.createResetToken = async function (userId) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getResetTokenForUserCommand, [userId], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      if (res.rows.length === 0) {
        const token = _this.generateToken({
          userId,
          command: createResetTokenCommand,
          length: _this.RESET_TOKEN_LENGTH
        });
        return resolve(token);
      } else if (res.rows[0].token) {
        if (
          new Date() >=
          new Date(
            new Date(res.rows[0].createdAt).setDate(
              new Date(res.rows[0].createdAt).getDate() + 1
            )
          )
        ) {
          const token = _this.generateToken({
            userId,
            command: createResetTokenCommand,
            length: _this.RESET_TOKEN_LENGTH
          });
          return resolve(token);
        }
        resolve(res.rows[0].token);
      } else {
        return reject(new DatabaseError("Unknown error generating token."));
      }
    });
  });
};

TokenController.prototype.getResetToken = async function (userId, token) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getResetTokenCommand, [userId], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      if (res.rows.length === 0) {
        return reject(
          new InvalidTokenError(`No token found for user ${userId}`)
        );
      }
      if (res.rows[0].token !== token) {
        return reject(
          new InvalidTokenError(`Token invalid for user ${userId}`)
        );
      }
      if (
        new Date() >=
        new Date(
          new Date(res.rows[0].createdAt).setDate(
            new Date(res.rows[0].createdAt).getDate() + 1
          )
        )
      ) {
        return reject(new InvalidTokenError("Token is expired"));
      }
      resolve(res.rows[0]);
    });
  });
};

TokenController.prototype.deleteVerifyTokens = async function () {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(deleteVerifyTokensCommand, function (err, res) {
      if (err) {
        reject(
          new DatabaseError(`Unable to delete verification tokens. [${err}]`)
        );
      }
      resolve({
        message: `Deleted verification token(s). [${res.rows.length}]`
      });
    });
  });
};

TokenController.prototype.deleteVerifyToken = async function (userId, token) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(
      deleteVerifyTokenCommand,
      [userId, token],
      function (err, res) {
        if (err) {
          reject(
            new DatabaseError(`Unable to delete verification token. [${err}]`)
          );
        }
        resolve({
          message: `Deleted verification token. [${res.rows.length}]`
        });
      }
    );
  });
};

TokenController.prototype.deleteResetTokens = async function () {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(deleteResetTokensCommand, function (err, res) {
      if (err) {
        reject(new DatabaseError(`Unable to delete reset tokens. [${err}]`));
      }
      resolve({
        message: `Deleted reset token(s). [${res.rows.length}]`
      });
    });
  });
};

TokenController.prototype.deleteResetToken = async function (userId, token) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(
      deleteResetTokenCommand,
      [userId, token],
      function (err, res) {
        if (err) {
          reject(new DatabaseError(`Unable to delete reset token. [${err}]`));
        }
        resolve({
          message: `Deleted reset token. [${res.rows.length}]`
        });
      }
    );
  });
};

module.exports = TokenController;
