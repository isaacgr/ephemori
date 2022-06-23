const { db, Database, createDatabase } = require("../db");
const database = new Database(db);
const ImportantDatesController = require("../../server/db/ImportantDates");
const { DatabaseError, DateError } = require("../../server/utils/errors");
const { USER_TIERS } = require("../../server/db/types");

const importantDatesController = new ImportantDatesController(db);

const user = {
  credentials: {
    email: "testsuite@gmail.com",
    password: "password"
  },
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

describe("DATABASE ImportantDatesService", () => {
  let userId = null;
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
      const res = await db.query(
        "INSERT INTO users(email, password, tier) VALUES($1, $2, $3) RETURNING id",
        [user.credentials.email, user.credentials.password, user.tier]
      );
      userId = res.rows[0].id;
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  afterEach(async () => {
    jest.clearAllMocks();
    try {
      const result = await database.dropTables();
      console.log(result);
    } catch (e) {
      console.log(e);
      process.exit(5);
    }
  });
  afterAll(() => {
    database.db.end();
  });
  describe("adding dates", () => {
    it("should add an important date for a given user", async () => {
      const result = await Promise.allSettled(
        importantDatesController.addImportantDates(userId, importantDates)
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            status: "fulfilled",
            value: {
              id: expect.any(String),
              date: expect.any(String),
              significance: expect.any(String),
              color: expect.any(String)
            }
          })
        ])
      );
    });
    it("should return the dates added for the given user", async () => {
      const result = await Promise.allSettled(
        importantDatesController.addImportantDates(userId, importantDates)
      );
      expect(result).toEqual([
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
        }
      ]);
    });
    it("should throw an error if dates are not an array", async () => {
      const e = async () => {
        await Promise.all(
          importantDatesController.addImportantDates(userId, importantDates[0])
        );
      };
      await expect(e()).rejects.toThrow(DateError);
      await expect(e()).rejects.toThrow("dates must be an array.");
    });
    it("should throw an error if color does not match valid type", async () => {
      const date = { ...importantDates[0] };
      date.color = "badhex";
      const e = async () => {
        await Promise.all(
          importantDatesController.addImportantDates(userId, [date])
        );
      };
      await expect(e()).rejects.toThrow(DateError);
      await expect(e()).rejects.toThrow(
        new DateError(
          "Color does not match valid type.",
          date.date,
          date.color,
          date.significance
        )
      );
    });
    it("should throw an error if date is invalid", async () => {
      const date = { ...importantDates[0] };
      date.date = "";
      const e = async () => {
        await Promise.all(
          importantDatesController.addImportantDates(userId, [date])
        );
      };
      await expect(e()).rejects.toThrow(DateError);
      await expect(e()).rejects.toThrow(
        new DateError(
          "Invalid date format.",
          date.date,
          date.color,
          date.significance
        )
      );
    });
    it("should throw an error if date is null", async () => {
      const date = { ...importantDates[0] };
      date.date = null;
      const e = async () => {
        await Promise.all(
          importantDatesController.addImportantDates(userId, [date])
        );
      };
      await expect(e()).rejects.toThrow(DatabaseError);
      await expect(e()).rejects.toThrow("Unable to set important date.");
    });
    it("should allow a basic user to add a date one day in the future", async () => {
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0];
      const date = {
        date: new Date(tomorrow).toISOString().split("T")[0],
        color: "#dfdfdf",
        significance: "test"
      };
      const result = await Promise.all(
        importantDatesController.addImportantDates(userId, [date])
      );
      expect(result).toEqual([
        {
          ...date,
          id: expect.any(String)
        }
      ]);
    });
    it("should allow a premium user to add a date in the future", async () => {
      await db.query("UPDATE users SET tier = 2 WHERE email = $1", [
        user.credentials.email
      ]);
      const date = {
        date: "2100-01-01",
        color: "#dfdfdf",
        significance: "test"
      };
      const result = await Promise.all(
        importantDatesController.addImportantDates(userId, [date])
      );
      expect(result).toEqual([
        {
          id: expect.any(String),
          ...date
        }
      ]);
    });
    it("should throw an error if the date is in the future and the user is not premium", async () => {
      const tomorrowplus1 = new Date(
        new Date().setDate(new Date().getDate() + 2)
      )
        .toISOString()
        .split("T")[0];
      const date = {
        date: new Date(tomorrowplus1).toISOString().split("T")[0],
        color: "#dfdfdf",
        significance: "test"
      };
      const e = async () => {
        await Promise.all(
          importantDatesController.addImportantDates(userId, [date])
        );
      };
      await expect(e()).rejects.toThrow(DateError);
      await expect(e()).rejects.toThrow(
        "Future dates only available for premium users."
      );
    });
  });
  describe("check count", () => {
    it("should return total number of dates if less than the defined max", async () => {
      const date = {
        date: "1970-01-01",
        significance: "epoch",
        color: "#000000"
      };
      const dates = [];
      for (
        let i = 0;
        i < ImportantDatesController.MAX_IMPORTANT_DATES[user.tier] - 1;
        i++
      ) {
        dates.push(date);
      }
      await Promise.all(
        importantDatesController.addImportantDates(userId, dates)
      );
      const total = await importantDatesController.checkImportantDatesCount(
        userId
      );
      expect(total).toBe(
        ImportantDatesController.MAX_IMPORTANT_DATES[user.tier] - 1
      );
    });
    it("should throw an error if user has max number of dates defined", async () => {
      const date = {
        date: "1970-01-01",
        significance: "epoch",
        color: "#000000"
      };
      const dates = [];
      for (
        let i = 0;
        i < ImportantDatesController.MAX_IMPORTANT_DATES[user.tier];
        i++
      ) {
        dates.push(date);
      }
      await Promise.all(
        importantDatesController.addImportantDates(userId, dates)
      );
      const e = async () => {
        await importantDatesController.checkImportantDatesCount(userId);
      };
      await expect(e()).rejects.toThrow(RangeError);
    });
    it("should throw an error if user has more than the max number of dates defined", async () => {
      const date = {
        date: "1970-01-01",
        significance: "epoch",
        color: "#000000"
      };
      const dates = [];
      for (
        let i = 0;
        i < ImportantDatesController.MAX_IMPORTANT_DATES[user.tier] + 1;
        i++
      ) {
        dates.push(date);
      }
      await Promise.all(
        importantDatesController.addImportantDates(userId, dates)
      );
      const e = async () => {
        await importantDatesController.checkImportantDatesCount(userId);
      };
      await expect(e()).rejects.toThrow(RangeError);
    });
    it("should return 0 if user has no dates defined", async () => {
      const res = await importantDatesController.checkImportantDatesCount(
        userId
      );
      expect(res).toBe(0);
    });
  });
  describe("get dates", () => {
    it("should return all the dates for a user", async () => {
      await Promise.all(
        importantDatesController.addImportantDates(userId, importantDates)
      );
      const dates = await importantDatesController.getImportantDates(userId);
      expect(dates.length).toBe(importantDates.length);
      expect(dates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            date: expect.any(String),
            significance: expect.any(String),
            color: expect.any(String)
          })
        ])
      );
    });
  });
  describe("get dates", () => {
    it("should return an empty list if user has no dates", async () => {
      const dates = await importantDatesController.getImportantDates(userId);
      expect(dates.length).toBe(0);
      expect(dates).toEqual([]);
    });
    it("should return a single date", async () => {
      const dates = await Promise.all(
        importantDatesController.addImportantDates(userId, importantDates)
      );
      const dateId = dates[0].id;
      const date = await importantDatesController.getImportantDate(
        userId,
        dateId
      );
      expect(date).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            date: expect.any(String),
            significance: expect.any(String),
            color: expect.any(String)
          })
        ])
      );
    });
    it("should return an empty array if date ID does not exist", async () => {
      const date = await importantDatesController.getImportantDate(
        userId,
        "00000000-0000-0000-0000-000000000000"
      );
      expect(date).toEqual([]);
    });
  });
  describe("remove dates", () => {
    it("should remove all dates in the list and return the IDs which were removed", async () => {
      const dates = await Promise.allSettled(
        importantDatesController.addImportantDates(userId, importantDates)
      );
      const ids = dates.map((date) => date.value.id);
      const dateIds = await Promise.all(
        await importantDatesController.removeImportantDates(userId, ids)
      );
      expect(ids).toEqual(dateIds);
      expect(ids).toEqual(expect.arrayContaining([expect.any(String)]));
    });
    it("should throw an error if the ids to remove are not an array", async () => {
      const e = async () => {
        await Promise.all(
          await importantDatesController.removeImportantDates(userId, "id")
        );
      };
      expect(e()).rejects.toThrow(TypeError);
    });
    it("should throw an error if no dates were removed", async () => {
      const e = async () => {
        await Promise.all(
          await importantDatesController.removeImportantDates(userId, [
            "00000000-0000-0000-0000-000000000000"
          ])
        );
      };
      expect(e()).rejects.toThrow(DateError);
    });
    it("should return an empty array if dates array is empty", async () => {
      const dateIds = await Promise.all(
        await importantDatesController.removeImportantDates(userId, [])
      );
      expect(dateIds).toEqual([]);
    });
  });
});
