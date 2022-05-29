/**
 * Adds a number of days to the given date object
 *
 * @param {number} days Number of days to add to the date object
 * @returns {Date} date object
 */
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Get the total number of weeks between the date object and current date
 *
 * From:
 *  https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 *
 * @see https://en.wikipedia.org/wiki/ISO_week_date
 * @see https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 *
 * @returns {number} Weeknumber for date object
 */
Date.prototype.getWeekNumber = function () {
  // Copy date so don't modify original
  const d = new Date(
    this.getUTCFullYear(),
    this.getUTCMonth(),
    this.getUTCDate()
  );
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

/**
 * Get the YYYY-mm-dd representation of the given date object
 *
 * @param {Date} date Date object to convert
 * @returns {string} String representing current date
 */
function getDateString(date) {
  const offset = date.getTimezoneOffset();
  const newDate = new Date(date.getTime() - offset * 60 * 1000);
  return newDate.toISOString().split("T")[0];
}

/**
 *
 * Get an array of date objects between start and stop date
 *
 * @param {Date} startDate Date to start at
 * @param {Date} stopDate Date to stop at
 * @returns {Date[]} Array of date objects
 */
function getDatesArray(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

/**
 * Returns the number of weeks between two dates
 *
 * @param {Date} d1
 * @param {Date} d2
 * @returns {number} Number of weeks between d1 and d2
 */
function weeksBetween(d1, d2) {
  return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
}

/**
 *
 * Gets the absolute week number for the given year
 * This does not take into account leap years etc. which may affect the total number
 * of weeks in a year.
 *
 * @example
 * getGridWeek(2, 1)
 * > 53 // The first week of the 2nd year would be 53
 *
 * @param {number} year Relative number representing the year. i.e. year 1, year 2 etc.
 * @param {number} week Relative Week number of the year. i.e. week 52 is the last week number of the year
 * @returns {number} Weeknumber representing the number of weeks from the first week of the first year
 */
function getGridWeek(year, week) {
  return year * 52 - (53 - week) + 1;
}

export { getDatesArray, getGridWeek, getDateString, weeksBetween };
