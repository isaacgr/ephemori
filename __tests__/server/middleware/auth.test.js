const makeApp = require("../../../server/app");
const { db, Database, createDatabase } = require("../../db");
const database = new Database(db);
const { sessionStore } = makeApp(db);
const { hashAndSalt } = require("../../../server/utils/hashing");

const user = {
  email: "testsuite@gmail.com",
  password: "test"
};

const UserService = require("../../../server/db/User");
const AuthService = require("../../../server/middleware/auth");
const SessionService = require("../../../server/db/Session");

describe(`MIDDLEWARE AuthService`, () => {
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
      console.log(result);
      const pass = await hashAndSalt(user.password);
      const res = await db.query(
        "INSERT INTO users(email, password) VALUES($1, $2) RETURNING id",
        [user.email, pass]
      );
      userId = res.rows[0].id;
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
  describe("isAuthenticated", () => {
    describe("responses", () => {
      it("should send a 401 response if request does not include cookies", async () => {
        const req = { session: { user: { id: userId } } };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = () => jest.fn();
        const statusSpy = jest.spyOn(res, "status");
        const sendSpy = jest.spyOn(res, "json");
        const authService = new AuthService(db);
        await authService.isAuthenticated(req, res, next);
        expect(statusSpy).toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(sendSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledWith({
          errorMessage: expect.stringContaining("User is not authenticated")
        });
      });
      it("should send a 401 response if cookies do not include a 'connect.sid'", async () => {
        const req = { session: { user: { id: userId } }, cookies: {} };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = () => jest.fn();
        const statusSpy = jest.spyOn(res, "status");
        const sendSpy = jest.spyOn(res, "json");
        const authService = new AuthService(db);
        await authService.isAuthenticated(req, res, next);
        expect(statusSpy).toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(sendSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledWith({
          errorMessage: expect.stringContaining("User is not authenticated")
        });
      });
      it("should send a 401 response if request does not include a valid session", async () => {
        const req = { session: {}, cookies: { "connect.sid": "sid" } };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = () => jest.fn();
        const statusSpy = jest.spyOn(res, "status");
        const sendSpy = jest.spyOn(res, "json");
        const authService = new AuthService(db);
        await authService.isAuthenticated(req, res, next);
        expect(statusSpy).toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(sendSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledWith({
          errorMessage: expect.stringContaining("User is not authenticated")
        });
      });
      it("should send a 401 response if user in session does not exist", async () => {
        const req = {
          session: { user: { id: "00000000-0000-0000-0000-000000000000" } },
          cookies: { "connect.sid": "sid" }
        };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = () => jest.fn();
        const statusSpy = jest.spyOn(res, "status");
        const sendSpy = jest.spyOn(res, "json");
        const authService = new AuthService(db);
        await authService.isAuthenticated(req, res, next);
        expect(statusSpy).toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(sendSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledWith({
          errorMessage: expect.stringContaining("No such user")
        });
      });
      it("should call next if authentication was successful", async () => {
        const req = {
          session: { user: { id: userId } },
          cookies: { "connect.sid": "sid" }
        };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = { fn: () => {} };
        const nextSpy = jest.spyOn(next, "fn");
        const authService = new AuthService(db);
        await authService.isAuthenticated(req, res, next.fn);
        expect(nextSpy).toHaveBeenCalled();
      });
    });
    describe("database calls", () => {
      it("should check that the user exists in the database", async () => {
        const getUserSpy = jest.spyOn(UserService.prototype, "getUserById");
        const req = {
          session: { user: { id: userId } },
          cookies: { "connect.sid": "sid" }
        };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = { fn: () => {} };
        const authService = new AuthService(db);
        await authService.isAuthenticated(req, res, next.fn);
        expect(getUserSpy).toHaveBeenCalled();
        expect(getUserSpy).toHaveBeenCalledWith(userId);
      });
    });
  });
  describe("isUserVerified", () => {
    describe("responses", () => {
      it("should call next if user is verified", async () => {
        await db.query(`UPDATE users SET verified = $1 WHERE id = $2`, [
          true,
          userId
        ]);
        const req = {
          body: {
            email: user.email
          },
          session: { user: { id: userId } },
          cookies: { "connect.sid": "sid" }
        };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = { fn: () => {} };
        const nextSpy = jest.spyOn(next, "fn");
        const authService = new AuthService(db);
        await authService.isUserVerified(req, res, next.fn);
        expect(nextSpy).toHaveBeenCalled();
      });
      it("should send a 401 response if user is not verified ", async () => {
        await db.query(`UPDATE users SET verified = $1 WHERE id = $2`, [
          false,
          userId
        ]);
        const req = {
          body: {
            email: user.email
          },
          session: { user: { id: userId } },
          cookies: { "connect.sid": "sid" }
        };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = { fn: () => {} };
        const statusSpy = jest.spyOn(res, "status");
        const sendSpy = jest.spyOn(res, "json");
        const authService = new AuthService(db);
        await authService.isUserVerified(req, res, next.fn);
        expect(statusSpy).toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(sendSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledWith({
          errorMessage: expect.stringContaining(
            "User has not verified their account"
          )
        });
      });
    });
    describe("database calls", () => {
      it("should check that the user is verified", async () => {
        const getUserSpy = jest.spyOn(UserService.prototype, "getUserVerfied");
        const req = {
          body: {
            email: user.email
          },
          session: { user: { id: userId } },
          cookies: { "connect.sid": "sid" }
        };
        const res = {
          json: function () {},
          status: function (responseStatus) {
            // This next line makes it chainable
            return this;
          }
        };
        const next = { fn: () => {} };
        const authService = new AuthService(db);
        await authService.isUserVerified(req, res, next.fn);
        expect(getUserSpy).toHaveBeenCalled();
        expect(getUserSpy).toHaveBeenCalledWith(user.email);
      });
    });
  });
});
