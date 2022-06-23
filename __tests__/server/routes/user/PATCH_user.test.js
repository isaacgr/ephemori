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
  password: "test",
  isUserSet: true,
  dateOfBirth: new Date().toISOString().split("T")[0]
};

const UserService = require("../../../../server/db/User");
const AuthService = require("../../../../server/middleware/auth");

describe(`PATCH ${ROUTE_PATHS.USER.SET_USER}`, () => {
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
    it("should send a 200 response for a valid  request", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const response = await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.USER.SET_USER}`)
        .send({ user: { ...user, id: userId } });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          dateOfBirth: user.dateOfBirth,
          isUserSet: true,
          id: userId
        }
      });
    });
    it("should send a 400 response if id in body does not match session", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: 0
          };
          next();
        });
      const response = await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.USER.SET_USER}`)
        .send({ user: { ...user, id: userId } });
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Invalid user set request.");
    });
    it("should send a 400 response if user object not sent", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            userId
          };
          next();
        });
      const response = await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.USER.SET_USER}`)
        .send({ ...user, userId });
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Invalid user set request.");
    });
    it("should send a 400 response if user object does not contain an id", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const response = await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.USER.SET_USER}`)
        .send({ user: { ...user } });
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Invalid user set request.");
    });
  });
  describe("database calls", () => {
    it("should make call to update the user", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const updateUserSpy = jest.spyOn(UserService.prototype, "updateUser");
      await request(app)
        .patch(`/api/${apiVersion}${ROUTE_PATHS.USER.SET_USER}`)
        .send({ user: { ...user, id: userId } });
      expect(updateUserSpy).toBeCalled();
      expect(updateUserSpy).toBeCalledWith({ ...user, id: userId });
    });
  });
});
