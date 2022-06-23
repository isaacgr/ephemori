const request = require("supertest");
const makeApp = require("../../../../server/app");
const { ROUTE_PATHS } = require("../../../../server/utils/constants");
const { hashAndSalt } = require("../../../../server/utils/hashing");
const { db, Database, createDatabase } = require("../../../db");
const database = new Database(db);
const { app, sessionStore } = makeApp(db);

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test"
};

const UserService = require("../../../../server/db/User");

describe(`GET ${ROUTE_PATHS.ACCOUNTS.EMAIL_VERIFICATION}`, () => {
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
        "INSERT INTO verification_tokens(token, user_id) VALUES($1, $2)",
        ["token", userId]
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
    it("should send a 200 response for valid verification request", async () => {
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.EMAIL_VERIFICATION}?token=token`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Email verified successfully."
      });
    });
    it("should send a 400 response if the token doesnt exist", async () => {
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.EMAIL_VERIFICATION}?token=nonexistent`
      );
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Token does not exist");
    });
    it("should send a 400 response if the user is already verified", async () => {
      await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.EMAIL_VERIFICATION}?token=token`
      );
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.EMAIL_VERIFICATION}?token=token`
      );
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("User already verified.");
    });
    it("should send a 400 response if no token is sent", async () => {
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.EMAIL_VERIFICATION}`
      );
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Token does not exist");
    });
  });
  describe("database calls", () => {
    it("should make a call to verify the user", async () => {
      const verifyUserSpy = jest.spyOn(UserService.prototype, "verifyUser");
      await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.EMAIL_VERIFICATION}?token=token`
      );
      expect(verifyUserSpy).toHaveBeenCalled();
      expect(verifyUserSpy).toHaveBeenCalledWith("token");
    });
  });
});
