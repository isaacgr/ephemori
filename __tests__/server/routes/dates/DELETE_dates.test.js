const request = require("supertest");
const makeApp = require("../../../../server/app");
const { ROUTE_PATHS } = require("../../../../server/utils/constants");
const { db, Database, createDatabase } = require("../../../db");
const database = new Database(db);
const { app, sessionStore } = makeApp(db);
const { toBeOneOf } = require("jest-extended");
const { hashAndSalt } = require("../../../../server/utils/hashing");
const { v4: uuidV4 } = require("uuid");

expect.extend({ toBeOneOf });

const apiVersion = "v1";
const user = {
  email: "testsuite@gmail.com",
  password: "test",
  isUserSet: true,
  dateOfBirth: new Date().toISOString().split("T")[0]
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

describe(`GET ${ROUTE_PATHS.DATES.DELETE_DATES}`, () => {
  let userId;
  let dateIds = [];
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
      dateIds = await Promise.all(
        importantDates.map(async (date) => {
          const res = await db.query(
            "INSERT INTO important_dates(id, date, color, significance, user_id) VALUES($1, $2, $3, $4, $5) RETURNING id",
            [uuidV4(), date.date, date.color, date.significance, userId]
          );
          return res.rows[0].id;
        })
      );
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
        .delete(`/api/${apiVersion}${ROUTE_PATHS.DATES.DELETE_DATES}`)
        .send({ dateIds });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          dates: expect.arrayContaining([
            expect.objectContaining({
              status: "fulfilled",
              value: expect.any(String)
            })
          ])
        })
      );
    });
    it("should send a 200 response with details on failures if any dates failed to delete", async () => {
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
        .delete(`/api/${apiVersion}${ROUTE_PATHS.DATES.DELETE_DATES}`)
        .send({
          dateIds: [dateIds[0], "00000000-0000-0000-0000-000000000000"]
        });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        dates: [
          {
            status: "fulfilled",
            value: expect.any(String)
          },
          {
            status: "rejected",
            reason: expect.stringContaining("No date to remove"),
            value: "00000000-0000-0000-0000-000000000000"
          }
        ]
      });
    });
    it("should send a 400 response if dateIds is not an array", async () => {
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
        .delete(`/api/${apiVersion}${ROUTE_PATHS.DATES.DELETE_DATES}`)
        .send({ dateIds: { dateIds } });
      expect(response.status).toBe(400);
      expect(response.body.errorMessage).toContain(
        "dateIds must be an array of date IDs."
      );
    });
  });
  describe("database calls", () => {
    it("should make a call to remove the dates", async () => {
      jest
        .spyOn(AuthService.prototype, "isAuthenticated")
        .mockImplementation((req, res, next) => {
          req.session.user = {
            ...user,
            id: userId
          };
          next();
        });
      const deleteDatesSpy = jest.spyOn(
        ImportantDatesService.prototype,
        "removeImportantDates"
      );
      await request(app)
        .delete(`/api/${apiVersion}${ROUTE_PATHS.DATES.DELETE_DATES}`)
        .send({ dateIds });
      expect(deleteDatesSpy).toBeCalled();
      expect(deleteDatesSpy).toBeCalledWith(userId, dateIds);
    });
  });
});
