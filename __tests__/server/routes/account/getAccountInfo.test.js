const request = require("supertest");
const { ROUTE_PATHS } = require("../../../../server/utils/constants");
const { db, Database, createDatabase } = require("../../../db");
const database = new Database(db);
const { hashAndSalt } = require("../../../../server/utils/hashing");
const makeApp = require("../../../../server/app");
const { app, sessionStore } = makeApp(db);

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test"
};

const UserService = require("../../../../server/db/User");
const AuthService = require("../../../../server/middleware/auth");

describe(`GET ${ROUTE_PATHS.ACCOUNTS.GET_ACCOUNT_INFO}`, () => {
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
    it("should send a 200 response if session oject has a valid user object", async () => {
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
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.GET_ACCOUNT_INFO}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        user: {
          dateOfBirth: null,
          displayName: null,
          isUserSet: false,
          email: user.email,
          id: userId
        }
      });
    });
    it("should send a 401 response if userId does not exist", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: "00000000-0000-0000-0000-000000000000"
          };
          next();
        });
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.GET_ACCOUNT_INFO}`
      );
      expect(response.status).toBe(401);
      expect(response.body.errorMessage).toContain("No such user.");
    });
    it("should send a 401 if request session object does not have valid user object", async () => {
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.GET_ACCOUNT_INFO}`
      );
      expect(response.status).toBe(401);
      expect(response.body.errorMessage).toContain("User is not authenticated");
    });
  });
  describe("database calls", () => {
    it("should make a call to getUserById", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const getAccInfoSpy = jest.spyOn(UserService.prototype, "getUserById");
      await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.GET_ACCOUNT_INFO}`
      );
      expect(getAccInfoSpy).toHaveBeenCalled();
      expect(getAccInfoSpy).toHaveBeenCalledWith(userId);
    });
  });
});
