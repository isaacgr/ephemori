const {
  AlreadyVerifiedError,
  InvalidTokenError,
  InvalidCredentialsError,
  DatabaseError,
  NoSuchUserError
} = require("../../utils/errors");
const { hashAndSalt, compareHash } = require("../../utils/hashing");

const {
  createUserCommand,
  getUserByIdCommand,
  getUserPasswordCommand,
  getUserByCredentialsCommand,
  setUserVerifiedCommand,
  checkUserVerfiedCommand,
  getUserVerifiedCommand,
  updatePasswordCommand,
  updateUserCommand,
  getUserTierCommand
} = require("./commands.js");

class UserController {
  constructor(db) {
    this.db = db;
  }
}

UserController.prototype.getUserTier = async function (userId) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getUserTierCommand, [userId], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message, err.code));
      }
      if (res.rows.length === 0) {
        /**
         * Likely the user doesnt exist if this
         * doesnt return anything
         */
        return reject(new NoSuchUserError("No tier found for user."));
      }
      resolve(res.rows[0].tier);
    });
  });
};

UserController.prototype.createUser = async function (user) {
  const _this = this;
  const { credentials } = user;
  const { email, password } = credentials;

  const hashedPassword = await hashAndSalt(password);

  return new Promise((resolve, reject) => {
    _this.db.query(
      createUserCommand,
      [email, hashedPassword],
      function (err, res) {
        if (err) {
          return reject(new DatabaseError(err.message, err.code));
        }
        console.log(`New user created. [${res.rowCount}]`);
        resolve(res.rows[0].id);
      }
    );
  });
};

UserController.prototype.getUserById = async function (userId) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getUserByIdCommand, [userId], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      if (res.rows.length === 0) {
        return reject(new NoSuchUserError(`No such user. [${userId}]`));
      }
      console.log(`Got user. [${res.rows[0].id}]`);
      resolve(res.rows[0]);
    });
  });
};

UserController.prototype.getUserByCredentials = async function (
  email,
  password
) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getUserPasswordCommand, [email], async function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      if (res.rows.length === 0) {
        return reject(new InvalidCredentialsError("Invalid credentials"));
      }
      try {
        const result = await compareHash(password, res.rows[0].password);
        if (!result) {
          return reject(new InvalidCredentialsError("Invalid credentials"));
        }
        _this.db.query(
          getUserByCredentialsCommand,
          [email],
          function (err, res) {
            if (err) {
              return reject(new DatabaseError(err.message));
            }
            resolve(res.rows[0]);
          }
        );
      } catch (e) {
        return reject(new DatabaseError(e.message));
      }
    });
  });
};

UserController.prototype.getUserByEmail = async function (email) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getUserByCredentialsCommand, [email], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      if (res.rows.length === 0) {
        return reject(new InvalidCredentialsError("Email does not exist"));
      }
      resolve(res.rows[0]);
    });
  });
};

UserController.prototype.verifyUser = async function (token) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(checkUserVerfiedCommand, [token], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      if (res.rows.length === 0) {
        return reject(
          new InvalidTokenError(`Token does not exist [${token}].`)
        );
      }
      if (res.rows[0].verified === true) {
        return reject(new AlreadyVerifiedError("User already verified."));
      }
      _this.db.query(
        setUserVerifiedCommand,
        [true, token],
        function (err, res) {
          if (err) {
            return reject(new DatabaseError(err.message));
          }
          console.log(`Verified user. [${res.rows[0].id}]`);
          const { email, displayName, dateOfBirth, isUserSet } = res.rows[0];
          resolve({
            email,
            displayName,
            dateOfBirth,
            isUserSet
          });
        }
      );
    });
  });
};

UserController.prototype.getUserVerfied = async function (email) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getUserVerifiedCommand, [email], function (err, res) {
      if (err) {
        return reject(
          new DatabaseError("Unable to get verification status for user.")
        );
      }
      if (res.rows.length === 0) {
        return reject(new NoSuchUserError(`No user with email [${email}]`));
      }
      resolve(res.rows[0].verified);
    });
  });
};

UserController.prototype.updateUser = async function ({
  dateOfBirth,
  isUserSet,
  id
}) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(
      updateUserCommand,
      [dateOfBirth, isUserSet, id],
      function (err, res) {
        if (err) {
          return reject(new DatabaseError(err.message, err.code));
        }
        /**
         * TODO: Handle empty rows
         */
        console.log(`Updated user. [${res.rows.length}]`);
        resolve(res.rows[0]);
      }
    );
  });
};

UserController.prototype.updatePassword = async function ({ id, password }) {
  const _this = this;
  const hashedPassword = await hashAndSalt(password);

  return new Promise((resolve, reject) => {
    _this.db.query(
      updatePasswordCommand,
      [hashedPassword, id],
      function (err, res) {
        if (err) {
          return reject(new DatabaseError(err.message, err.code));
        }
        console.log(`Updated user password. [${res.rows[0].length}]`);
        resolve({
          id: res.rows[0].id
        });
      }
    );
  });
};

module.exports = UserController;
