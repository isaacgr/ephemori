const request = require("supertest");
const makeApp = require("../../../../server/app");
const { ROUTE_PATHS } = require("../../../../server/utils/constants");
const { db, Database, createDatabase } = require("../../../db");
const database = new Database(db);
const { app, sessionStore } = makeApp(db);
const { toBeOneOf } = require("jest-extended");
const { hashAndSalt } = require("../../../../server/utils/hashing");
const { USER_TIERS } = require("../../../../server/db/types");

expect.extend({ toBeOneOf });

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test",
  isUserSet: true,
  dateOfBirth: new Date().toISOString().split("T")[0],
  tier: USER_TIERS.basic
};

const importantDates = [
  {
    date: "1970-01-01",
    significance: "epoch",
    color: "#000000"
  },
  {
    date: "1992-01-29",
    significance: "bday",
    color: "#000000"
  },
  {
    date: "1989-12-17",
    significance: "first",
    color: "#FFFF00"
  }
];

const ImportantDatesService = require("../../../../server/db/ImportantDates");
const AuthService = require("../../../../server/middleware/auth");

describe(`POST ${ROUTE_PATHS.DATES.ADD_DATES}`, () => {
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
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.DATES.ADD_DATES}`)
        .send({ dates: importantDates });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          dates: expect.arrayContaining([
            expect.objectContaining({
              status: "fulfilled",
              value: expect.objectContaining({
                id: expect.any(String),
                date: expect.any(String),
                significance: expect.any(String),
                color: expect.any(String)
              })
            })
          ])
        })
      );
    });
    it("should send a 200 response with details on failures if any dates failed to add", async () => {
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
        .post(`/api/${apiVersion}${ROUTE_PATHS.DATES.ADD_DATES}`)
        .send({
          dates: [
            ...importantDates,
            {
              date: "invalidDate",
              significance: "epoch",
              color: "#000000"
            }
          ]
        });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        dates: [
          {
            status: "fulfilled",
            value: {
              id: expect.any(String),
              date: "1970-01-01",
              significance: "epoch",
              color: "#000000"
            }
          },
          {
            status: "fulfilled",
            value: {
              id: expect.any(String),
              date: "1992-01-29",
              significance: "bday",
              color: "#000000"
            }
          },
          {
            status: "fulfilled",
            value: {
              id: expect.any(String),
              date: "1989-12-17",
              significance: "first",
              color: "#FFFF00"
            }
          },
          {
            status: "rejected",
            reason: expect.any(String),
            value: {
              date: "invalidDate",
              significance: "epoch",
              color: "#000000"
            }
          }
        ]
      });
    });
    it("should send a 400 response if max number of dates is already in place", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const maxdates = [];
      for (
        let i = 0;
        i < ImportantDatesService.MAX_IMPORTANT_DATES[user.tier];
        i++
      ) {
        maxdates.push(importantDates[0]);
      }
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.DATES.ADD_DATES}`)
        .send({ dates: maxdates });
      const response = await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.DATES.ADD_DATES}`)
        .send({ dates: importantDates });
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain(
        `Maximum number of important dates allowed for user is ${
          ImportantDatesService.MAX_IMPORTANT_DATES[user.tier]
        }`
      );
    });
  });
  describe("database calls", () => {
    it("should make a call to check how many dates the user has defined", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const checkDatesSpy = jest.spyOn(
        ImportantDatesService.prototype,
        "checkImportantDatesCount"
      );
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.DATES.ADD_DATES}`)
        .send({ dates: importantDates });
      expect(checkDatesSpy).toBeCalled();
      expect(checkDatesSpy).toBeCalledWith(userId);
    });
    it("should make a call to add the important dates", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const checkDatesSpy = jest.spyOn(
        ImportantDatesService.prototype,
        "addImportantDates"
      );
      await request(app)
        .post(`/api/${apiVersion}${ROUTE_PATHS.DATES.ADD_DATES}`)
        .send({ dates: importantDates });
      expect(checkDatesSpy).toBeCalled();
      expect(checkDatesSpy).toBeCalledWith(userId, importantDates);
    });
  });
});
