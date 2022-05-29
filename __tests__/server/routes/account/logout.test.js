const request = require("supertest");
const makeApp = require("../../../../server/app");
const { ROUTE_PATHS } = require("../../../../server/utils/constants");
const { db, Database, createDatabase } = require("../../../db");
const database = new Database(db);
const { app, sessionStore } = makeApp(db);
const { hashAndSalt } = require("../../../../server/utils/hashing");

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test"
};

const AuthService = require("../../../../server/middleware/auth");

describe(`GET ${ROUTE_PATHS.ACCOUNTS.LOGOUT}`, () => {
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
        [user.email, pass, true]
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
    it("should redirect the user if request is valid", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGOUT}`
      );
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe("/");
    });
    it("should destroy the session if request is valid", async () => {
      let sessionSpy = null;
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          sessionSpy = jest.spyOn(req.session, "destroy");
          next();
        });
      await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGOUT}`
      );
      expect(sessionSpy).toHaveBeenCalled();
    });
    it("should send a 401 error if the session object does not contain a user object", async () => {
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGOUT}`
      );
      expect(response.status).toBe(401);
      expect(response.body.errorMessage).toContain("User is not authenticated");
    });
  });
});
