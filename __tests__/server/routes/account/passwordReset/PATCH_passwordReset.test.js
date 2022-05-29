const request = require("supertest");
const makeApp = require("../../../../../server/app");
const { ROUTE_PATHS } = require("../../../../../server/utils/constants");
const { db, Database, createDatabase } = require("../../../../db");
const database = new Database(db);
const { app, sessionStore } = makeApp(db);
const {
  hashAndSalt,
  compareHash
} = require("../../../../../server/utils/hashing");

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test",
  newPassword: "newpass"
};
const token = "token";

const UserService = require("../../../../../server/db/User");
const TokenService = require("../../../../../server/db/Token");

describe(`PATCH ${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`, () => {
  let userId;
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
      const pass = await hashAndSalt(user.password);
      const res = await db.query(
        "INSERT INTO users(email, password, verified) VALUES($1, $2, $3) RETURNING id",
        [user.email, pass, false]
      );
      userId = res.rows[0].id;
      await db.query(
        "INSERT INTO reset_tokens(token, user_id) VALUES($1, $2)",
        [token, userId]
      );
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  afterEach(async () => {
    clearInterval(sessionStore.cleanupTimer);
    jest.restoreAllMocks();
    try {
      const result = await database.dropTables();
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  afterAll(() => {
    sessionStore.close();
    database.db.end();
  });
  describe("responses", () => {
    it("should respond with a 200 status code if the reset request was successful", async () => {
      const response = await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ token, password: user.newPassword, id: userId });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Password has been updated."
      });
    });
    it("should update the users password if the request is valid", async () => {
      await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ token, password: user.newPassword, id: userId });
      db.query(
        `SELECT password FROM users WHERE id = $1`,
        [userId],
        async function (err, res) {
          if (err) {
            throw err;
          }
          if (res.rows.length === 0) {
            throw new Error("No row");
          }
          expect(
            await compareHash(user.newPassword, res.rows[0].password)
          ).toBe(true);
        }
      );
    });
    it("should respond with a 400 status code if the token is invalid", async () => {
      const response = await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({
          token: "invalidtoken",
          password: user.newPassword,
          id: userId
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.errorMessage).toContain("Token invalid for user");
    });
    it("should respond with a 400 status code if the userId is invalid", async () => {
      const response = await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({
          token,
          password: user.newPassword,
          id: "00000000-0000-0000-0000-000000000000"
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.errorMessage).toContain("No token found for user");
    });
  });
  describe("effects", () => {
    it("should delete the token after the password has been updated", async () => {
      await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ token, password: user.newPassword, id: userId });
      const res = await db.query(
        `SELECT token FROM reset_tokens WHERE user = $1`,
        [userId]
      );
      expect(res.rows.length).toBe(0);
    });
  });
  describe("database calls", () => {
    it("should make a call to get the token", async () => {
      const getResetTokenSpy = jest.spyOn(
        TokenService.prototype,
        "getResetToken"
      );
      await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ token, password: user.newPassword, id: userId });
      expect(getResetTokenSpy).toHaveBeenCalled();
      expect(getResetTokenSpy).toHaveBeenCalledWith(userId, token);
    });
    it("should make a call to update the password", async () => {
      const updatePasswordSpy = jest.spyOn(
        UserService.prototype,
        "updatePassword"
      );
      await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ token, password: user.newPassword, id: userId });
      expect(updatePasswordSpy).toHaveBeenCalled();
      expect(updatePasswordSpy).toHaveBeenCalledWith({
        id: userId,
        password: user.newPassword
      });
    });
    it("should make a call to delete the reset token", async () => {
      const deleteResetTokenSpy = jest.spyOn(
        TokenService.prototype,
        "deleteResetToken"
      );
      await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ token, password: user.newPassword, id: userId });
      expect(deleteResetTokenSpy).toHaveBeenCalled();
      expect(deleteResetTokenSpy).toHaveBeenCalledWith(userId, token);
    });
  });
});
