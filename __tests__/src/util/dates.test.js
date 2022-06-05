/** @jest-environment jsdom */

import {
  getDatesArray,
  getGridWeek,
  getDateString,
  weeksBetween
} from "../../../src/util/dates";

describe("UTIL dates", () => {
  describe("getDateString", () => {
    it("should return the YYYY-MM-dd representation of a date", () => {
      const date = new Date();
      const dateString = getDateString(date);
      const offset = date.getTimezoneOffset();
      const newDate = new Date(date.getTime() - offset * 60 * 1000);
      expect(dateString).toBe(newDate.toISOString().split("T")[0]);
    });
  });
  describe("Date.prototype.addDays", () => {
    it("should add a given number of days to the date object", () => {
      const date = new Date("2022-05-13");
      const newDate = date.addDays(1);
      expect(newDate).toEqual(new Date("2022-05-14"));
    });
  });
  describe("Date.prototype.getWeekNumber", () => {
    it("should return the weeknumber for the given date", () => {
      let date;
      let weeknumber;
      date = new Date("2022-01-03");
      weeknumber = date.getWeekNumber();
      expect(weeknumber).toBe(1);
      date = new Date("2012-01-01");
      weeknumber = date.getWeekNumber();
      expect(weeknumber).toBe(52);
      date = new Date("2014-12-29");
      weeknumber = date.getWeekNumber();
      expect(weeknumber).toBe(1);
    });
  });
  describe("getDatesArray", () => {
    it("should return an array of all dates between two dates, inclusive", () => {
      const correctOutput = [
        new Date("2020-01-26"),
        new Date("2020-01-27"),
        new Date("2020-01-28"),
        new Date("2020-01-29"),
        new Date("2020-01-30"),
        new Date("2020-01-31")
      ];
      const res = getDatesArray(new Date("2020-01-26"), new Date("2020-01-31"));
      expect(res).toEqual(correctOutput);
    });
  });
  describe("getGridWeek", () => {
    it("should return the relative weeknumber given a year and week", () => {
      const weeknumber = getGridWeek(2, 1);
      expect(weeknumber).toBe(53);
    });
  });
  describe("weeksBetween", () => {
    it("should return number of weeks between two dates", () => {
      const date = new Date("2022-01-01");
      const weeknumber = weeksBetween(
        date,
        new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 7
        )
      );
      expect(weeknumber).toBe(1);
    });
  });
});
