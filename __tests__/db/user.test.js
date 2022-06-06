const { db, Database, createDatabase } = require("../db");
const database = new Database(db);
const UserController = require("../../server/db/User");
const {
  DatabaseError,
  InvalidCredentialsError,
  NoSuchUserError,
  InvalidTokenError,
  AlreadyVerifiedError
} = require("../../server/utils/errors");
const { compareHash } = require("../../server/utils/hashing");
const { USER_TIERS } = require("../../server/db/types");

const userController = new UserController(db);

const user = {
  credentials: {
    email: "testsuite@gmail.com",
    password: "password"
  }
};

describe("DATABASE UserService", () => {
  beforeAll(async () => {
    try {
      const result = await createDatabase();
      await database.dropTables();
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  beforeEach(async () => {
    try {
      const result = await database.createTables();
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  afterEach(async () => {
    try {
      const result = await database.dropTables();
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  afterAll(() => {
    database.db.end();
  });
  describe("create user", () => {
    it("should create a new user and return the userId", async () => {
      const userId = await userController.createUser(user);
      expect(typeof userId).toBe("string");
    });
    it("should be unable to create a user with the same email", async () => {
      const e = async () => {
        await userController.createUser(user);
        await userController.createUser(user);
      };
      await expect(e()).rejects.toThrow(DatabaseError);
    });
    it("should hash the password for the user", async () => {
      const userId = await userController.createUser(user);
      db.query(
        `SELECT password FROM users WHERE id = $1`,
        [userId],
        async function (err, result) {
          if (err) {
            throw err;
          }
          if (!result.rows[0] || !result.rows[0].password) {
            throw new Error("Empty row");
          }
          expect(result.rows[0].password === user.credentials.password).toBe(
            false
          );
          expect(
            await compareHash(
              user.credentials.password,
              result.rows[0].password
            )
          ).toBe(true);
        }
      );
    });
  });
  describe("get user", () => {
    describe("by ID", () => {
      it("should get a user by ID", async () => {
        const userId = await userController.createUser(user);
        const createdUser = await userController.getUserById(userId);
        expect(typeof createdUser).toBe("object");
        expect(createdUser).toEqual({
          id: expect.any(String),
          email: user.credentials.email,
          displayName: null,
          dateOfBirth: null,
          isUserSet: false
        });
      });
      it("should raise an error if the userId does not exist", async () => {
        const e = async () => {
          await userController.getUserById(
            "00000000-0000-0000-0000-000000000000"
          );
        };
        await expect(e()).rejects.toThrow(NoSuchUserError);
      });
    });
    describe("by credentials", () => {
      it("should get a user by their credentials", async () => {
        const userId = await userController.createUser(user);
        const createdUser = await userController.getUserByCredentials(
          user.credentials.email,
          user.credentials.password
        );
        expect(typeof createdUser).toBe("object");
        expect(createdUser).toEqual({
          id: userId,
          email: user.credentials.email,
          displayName: null,
          dateOfBirth: null,
          isUserSet: false
        });
      });
      it("should raise an error if email does not exist", async () => {
        const e = async () => {
          await userController.createUser(user);
          await userController.getUserByCredentials(
            "badEmail",
            user.credentials.password
          );
        };
        await expect(e()).rejects.toThrow(InvalidCredentialsError);
      });
      it("should raise an error if password is incorrect", async () => {
        const e = async () => {
          await userController.createUser(user);
          await userController.getUserByCredentials(
            user.credentials.email,
            "badPassword"
          );
        };
        await expect(e()).rejects.toThrow(InvalidCredentialsError);
      });
    });
    describe("by email", () => {
      it("should get a user by email", async () => {
        const userId = await userController.createUser(user);
        const createdUser = await userController.getUserByEmail(
          user.credentials.email
        );
        expect(typeof createdUser).toBe("object");
        expect(createdUser).toEqual({
          id: userId,
          email: user.credentials.email,
          displayName: null,
          dateOfBirth: null,
          isUserSet: false
        });
      });
      it("should raise an error if the email does not exist", async () => {
        const e = async () => {
          await userController.getUserByEmail(user.credentials.email);
        };
        await expect(e()).rejects.toThrow(InvalidCredentialsError);
      });
    });
  });
  describe("verify user", () => {
    beforeEach((done) => {
      db.query(
        "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *",
        [user.credentials.email, user.credentials.password],
        function (err, res) {
          if (err) {
            throw err;
          }
          const userId = res.rows[0].id;
          db.query(
            "INSERT INTO verification_tokens(token, user_id) VALUES($1, $2)",
            ["token", userId],
            function (err) {
              if (err) {
                throw err;
              }
              done();
            }
          );
        }
      );
    });
    it("should verify and return user", async () => {
      const verifiedUser = await userController.verifyUser("token");
      expect(typeof verifiedUser).toBe("object");
      expect(verifiedUser).toEqual({
        email: user.credentials.email,
        displayName: null,
        dateOfBirth: null,
        isUserSet: false
      });
    });
    it("should get the verification status of a user", (done) => {
      db.query(`UPDATE users SET verified = true`, async function (err) {
        if (err) {
          throw err;
        }
        try {
          const verified = await userController.getUserVerfied(
            user.credentials.email
          );
          expect(verified).toBe(true);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
    it("should throw an error if the user does not exist", (done) => {
      db.query(`UPDATE users SET verified = true`, async function (err) {
        if (err) {
          throw err;
        }
        const e = async () => {
          await userController.getUserVerfied("bademail");
        };
        await expect(e()).rejects.toThrow(NoSuchUserError);
        done();
      });
    });
    it("should throw an error if the user is already verified", (done) => {
      db.query(`UPDATE users SET verified = true`, async function (err) {
        if (err) {
          throw err;
        }
        const e = async () => {
          await userController.verifyUser("token");
        };
        await expect(e()).rejects.toThrow(AlreadyVerifiedError);
        done();
      });
    });
    it("should throw an error if the token does not exist", async () => {
      const e = async () => {
        await userController.verifyUser("badtoken");
      };
      await expect(e()).rejects.toThrow(InvalidTokenError);
    });
  });
  describe("update user", () => {
    describe("password", () => {
      it("should update the users password", async () => {
        const userId = await userController.createUser(user);
        const oldPass = await new Promise((resolve, reject) => {
          db.query(
            `SELECT password FROM users WHERE id = $1`,
            [userId],
            function (err, res) {
              if (err) {
                return reject(err);
              }
              if (res.rows.length === 0) {
                return reject(new Error("Empty row"));
              }
              resolve(res.rows[0].password);
            }
          );
        });
        await userController.updatePassword({
          id: userId,
          password: "newpassword"
        });
        const newPass = await new Promise((resolve, reject) => {
          db.query(
            `SELECT password FROM users WHERE id = $1`,
            [userId],
            function (err, res) {
              if (err) {
                return reject(err);
              }
              if (res.rows.length === 0) {
                return reject(new Error("Empty row"));
              }
              resolve(res.rows[0].password);
            }
          );
        });
        expect(oldPass).not.toEqual(newPass);
        expect(await compareHash("newpassword", newPass)).toBe(true);
      });
    });
    describe("profile", () => {
      it("should update the users profile information and set the user", async () => {
        const userId = await userController.createUser(user);
        const dob = new Date().toISOString().split("T")[0];
        const userInfo = await userController.updateUser({
          dateOfBirth: dob,
          id: userId,
          isUserSet: true
        });
        expect(userInfo).toEqual({
          dateOfBirth: dob,
          isUserSet: true,
          id: userId
        });
      });
      it("should update the users profile information and set the user to false", async () => {
        const userId = await userController.createUser(user);
        const dob = new Date().toISOString().split("T")[0];
        const userInfo = await userController.updateUser({
          dateOfBirth: dob,
          id: userId,
          isUserSet: false
        });
        expect(userInfo).toEqual({
          dateOfBirth: dob,
          isUserSet: false,
          id: userId
        });
      });
    });
  });
});
