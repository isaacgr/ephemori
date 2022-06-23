const request = require("supertest");
const makeApp = require("../../../../server/app");
const { ROUTE_PATHS } = require("../../../../server/utils/constants");
const { db, Database, createDatabase } = require("../../../db");
const database = new Database(db);
const { app, sessionStore } = makeApp(db);

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test"
};

const UserService = require("../../../../server/db/User");
const TokenService = require("../../../../server/db/Token");

// const sendMailMock = jest.fn();
// jest.mock("nodemailer");
// const nodemailer = require("nodemailer");
// nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
jest.mock("../../../../server/email/mailer");
const sendMail = require("../../../../server/email/mailer");

describe(`POST ${ROUTE_PATHS.ACCOUNTS.SIGN_UP}`, () => {
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
    it("should respond with a 201 status code if the signup was successful", async () => {
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.SIGN_UP}`)
        .send(user);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: "An email has been sent to verify your account."
      });
    });
    it("should respond with a 400 status code if the email is invalid", async () => {
      const badUser = { ...user };
      badUser.email = "bademail";
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.SIGN_UP}`)
        .send(badUser);
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Invalid email format");
    });
    it("should respond with a 400 status code if the email already exists", async () => {
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.SIGN_UP}`)
        .send(user);
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.SIGN_UP}`)
        .send(user);
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain(
        'DATABASE_ERROR : duplicate key value violates unique constraint "users_email_key"'
      );
    });
  });
  describe("email", () => {
    it("should send an email to the user", async () => {
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.SIGN_UP}`)
        .send(user);
      expect(sendMail).toHaveBeenCalled();
    });
  });
  describe("database calls", () => {
    it("should create the user and verification token", async () => {
      const createUserSpy = jest.spyOn(UserService.prototype, "createUser");
      const createVerifyTokenSpy = jest.spyOn(
        TokenService.prototype,
        "createVerifyToken"
      );
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.SIGN_UP}`)
        .send(user);
      expect(createUserSpy).toHaveBeenCalled();
      expect(createVerifyTokenSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalledWith({
        credentials: user
      });
    });
  });
});
