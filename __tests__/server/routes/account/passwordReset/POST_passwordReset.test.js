const request = require("supertest");
const makeApp = require("../../../../../server/app");
const { ROUTE_PATHS } = require("../../../../../server/utils/constants");
const { hashAndSalt } = require("../../../../../server/utils/hashing");
const { db, Database, createDatabase } = require("../../../../db");
const database = new Database(db);
const { app, sessionStore } = makeApp(db);

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test"
};

const UserService = require("../../../../../server/db/User");
const TokenService = require("../../../../../server/db/Token");

jest.mock("../../../../../server/email/mailer");
const sendMail = require("../../../../../server/email/mailer");

describe(`POST ${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`, () => {
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
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ email: user.email });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "An email has been sent to reset your password."
      });
    });
    it("should respond with a 400 status code if the email is invalid", async () => {
      const badUser = { ...user };
      badUser.email = "bademail";
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ email: badUser.email });
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Email does not exist");
    });
  });
  describe("email", () => {
    it("should send an email to the user", async () => {
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ email: user.email });
      expect(sendMail).toHaveBeenCalled();
    });
  });
  describe("database calls", () => {
    it("should create the user and verification token", async () => {
      const createUserSpy = jest.spyOn(UserService.prototype, "getUserByEmail");
      const createResetTokenSpy = jest.spyOn(
        TokenService.prototype,
        "createResetToken"
      );
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET}`)
        .send({ email: user.email });
      expect(createUserSpy).toHaveBeenCalled();
      expect(createResetTokenSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalledWith(user.email);
      expect(createResetTokenSpy).toHaveBeenCalledWith(userId);
    });
  });
});
