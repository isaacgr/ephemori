const request = require("supertest");
const makeApp = require("../../../../server/app");
const { ROUTE_PATHS } = require("../../../../server/utils/constants");
const { USER_TIERS } = require("../../../../server/db/types");
const { db, Database, createDatabase } = require("../../../db");
const database = new Database(db);
const { app, sessionStore } = makeApp(db);
const { hashAndSalt } = require("../../../../server/utils/hashing");

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test",
  isUserSet: true,
  dateOfBirth: new Date().toISOString().split("T")[0]
};

const UserService = require("../../../../server/db/User");
const AuthService = require("../../../../server/middleware/auth");

describe(`GET ${ROUTE_PATHS.USER.TIER}`, () => {
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
  describe("responses", () => {
    it("should send a 200 response for a valid request", async () => {
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
        `/api/${apiVersion}${ROUTE_PATHS.USER.TIER}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          tier: USER_TIERS.basic
        }
      });
    });
    it("should send a 400 response if id in session is invalid", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: 0
          };
          next();
        });
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.USER.TIER}`
      );
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("DATABASE_ERROR");
    });
    it("should send a 401 response if user is not authenticated", async () => {
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.USER.TIER}`
      );
      expect(response.status).toBe(401);
      expect(response.body.errorMessage).toContain("User is not authenticated");
    });
    it("should send a 400 response if request.session.user does not contain an id", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user
          };
          next();
        });
      const response = await request(app).get(
        `/api/${apiVersion}${ROUTE_PATHS.USER.TIER}`
      );
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Invalid user get request.");
    });
  });
  describe("database calls", () => {
    it("should make call to get the user tier", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const updateUserSpy = jest.spyOn(UserService.prototype, "getUserTier");
      await request(app).get(`/api/${apiVersion}${ROUTE_PATHS.USER.TIER}`);
      expect(updateUserSpy).toBeCalled();
      expect(updateUserSpy).toBeCalledWith(userId);
    });
  });
});
