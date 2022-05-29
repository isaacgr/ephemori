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

const UserService = require("../../../../server/db/User");

describe(`POST ${ROUTE_PATHS.ACCOUNTS.LOGIN}`, () => {
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
    it("should send a 200 response for a successful login", async () => {
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGIN}`)
        .send(user);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          user: expect.objectContaining({
            dateOfBirth: null,
            displayName: null,
            email: user.email,
            isUserSet: false,
            id: userId
          })
        })
      );
    });
    it("should send a 401 response if the email is invalid", async () => {
      const badUser = { ...user };
      badUser.email = "bademail";
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGIN}`)
        .send(badUser);
      expect(response.status).toBe(401);
      expect(response.body.errorMessage).toContain("NO_SUCH_USER");
    });
    it("should send a 400 response if the password is invalid", async () => {
      const badUser = { ...user };
      badUser.password = "badpass";
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGIN}`)
        .send(badUser);
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain("Invalid credentials");
    });
    // it('should attach the user credentials to the request session', async () => {
    //   const response = await request(app).post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGIN}`).send(user)
    //   expect(response.status).toBe(200)
    //   expect(response.session.user).toEqual(expect.objectContaining({
    //     dateOfBirth: null,
    //     displayName: null,
    //     email: user.email,
    //     isUserSet: 0,
    //     userId: expect.any(Number)
    //   }))
    // })
    it("should send a 401 response if the user is not verified", async () => {
      await db.query("UPDATE users SET verified = $1 WHERE email = $2", [
        false,
        user.email
      ]);
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGIN}`)
        .send(user);
      expect(response.status).toBe(401);
      expect(response.body.errorMessage).toContain(
        "User has not verified their account"
      );
    });
  });
  describe("database calls", () => {
    it("should make a call to login the user", async () => {
      const loginSpy = jest.spyOn(
        UserService.prototype,
        "getUserByCredentials"
      );
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.ACCOUNTS.LOGIN}`)
        .send(user);
      expect(loginSpy).toHaveBeenCalled();
      expect(loginSpy).toHaveBeenCalledWith(user.email, user.password);
    });
  });
});
