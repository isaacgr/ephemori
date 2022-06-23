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

const TokenService = require("../../../../../server/db/Token");

describe(`GET ${ROUTE_PATHS.ACCOUNTS.RESET_VERIFICATION}`, () => {
  let userId;
  beforeAll(async () => {
    try {
      const result = await createDatabase(process.env.DATABASE_NAME);
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
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.RESET_VERIFICATION}?userId=${userId}&token=${token}`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Reset request verified."
      });
    });
    it("should respond with a 400 status code if the token is invalid", async () => {
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.RESET_VERIFICATION}?userId=${userId}&token=invalidtoken`
      );
      expect(response.statusCode).toBe(400);
      expect(response.body.errorMessage).toContain("Token invalid for user");
    });
    it("should respond with a 400 status code if the userId is invalid", async () => {
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.RESET_VERIFICATION}?userId=00000000-0000-0000-0000-000000000000&token=${token}`
      );
      expect(response.statusCode).toBe(400);
      expect(response.body.errorMessage).toContain("No token found for user");
    });
  });
  describe("database calls", () => {
    it("should make a call to get the token", async () => {
      const getResetTokenSpy = jest.spyOn(
        TokenService.prototype,
        "getResetToken"
      );
      await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.RESET_VERIFICATION}?userId=${userId}&token=${token}`
      );
      expect(getResetTokenSpy).toHaveBeenCalled();
      expect(getResetTokenSpy).toHaveBeenCalledWith(userId, token);
    });
  });
});
