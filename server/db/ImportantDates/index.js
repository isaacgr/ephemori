const isValidDate = require("../../utils/isValidDate");
const { DatabaseError, DateError } = require("../../utils/errors");
const {
  getImportantDatesCommand,
  getImportantDateCommand,
  getImportantDatesCountCommand,
  removeImportantDatesCommand,
  addImportantDatesCommand
} = require("./commands");

class ImportantDatesController {
  static COLOR_PATTERN = /^#([0-9a-f]{3}){1,2}$/i;
  static MAX_IMPORTANT_DATES = 80;
  constructor(database) {
    this.db = database;
  }
}

ImportantDatesController.prototype.checkImportantDatesCount = async function (
  userId
) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(
      getImportantDatesCountCommand,
      [userId],
      function (err, res) {
        if (err) {
          reject(new DatabaseError(err.message));
        }
        /**
         * TODO: Handle empty rows
         */
        if (
          parseInt(res.rows[0].total) >= _this.constructor.MAX_IMPORTANT_DATES
        ) {
          reject(
            new RangeError(
              `Maximum number of important dates allowed per user is ${_this.constructor.MAX_IMPORTANT_DATES}.`
            )
          );
        }
        resolve(parseInt(res.rows[0].total));
      }
    );
  });
};

ImportantDatesController.prototype.getImportantDates = async function (userId) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(getImportantDatesCommand, [userId], function (err, res) {
      if (err) {
        return reject(new DatabaseError(err.message));
      }
      console.log(`Got all dates for user. [${userId}].`);
      resolve(res.rows);
    });
  });
};

ImportantDatesController.prototype.getImportantDate = async function (
  userId,
  dateId
) {
  const _this = this;
  return new Promise((resolve, reject) => {
    _this.db.query(
      getImportantDateCommand,
      [userId, dateId],
      function (err, res) {
        if (err) {
          return reject(new DatabaseError(err.message));
        }
        console.log(`Got date. [${dateId}].`);
        resolve(res.rows);
      }
    );
  });
};

ImportantDatesController.prototype.removeImportantDates = async function (
  userId,
  dateIds
) {
  const _this = this;
  if (!Array.isArray(dateIds)) {
    throw new TypeError("dateIds must be an array of date IDs.");
  }
  return dateIds.map((dateId) => {
    return new Promise((resolve, reject) => {
      _this.db.query(
        removeImportantDatesCommand,
        [userId, dateId],
        function (err, res) {
          if (err) {
            return reject(
              new DatabaseError(
                `Unable to remove important date. Date [${dateId}]. Error [${err.message}]`
              )
            );
          }
          if (res.rows.length === 0) {
            return reject(new DateError("No date to remove", { id: dateId }));
          } else {
            console.log(`Important date removed [${dateId}]. User [${userId}]`);
            resolve(res.rows[0].id);
          }
        }
      );
    });
  });
};

ImportantDatesController.prototype.addImportantDates = function (
  userId,
  importantDates
) {
  const _this = this;
  if (!Array.isArray(importantDates)) {
    throw new DateError("dates must be an array.");
  }
  return importantDates.map((importantDate) => {
    return new Promise((resolve, reject) => {
      const { date, color, significance } = importantDate;
      if (!color.match(_this.constructor.COLOR_PATTERN)) {
        return reject(
          new DateError("Color does not match valid type.", {
            date,
            color,
            significance
          })
        );
      }
      if (!isValidDate(new Date(date))) {
        return reject(
          new DateError("Invalid date format.", { date, color, significance })
        );
      }
      _this.db.query(
        addImportantDatesCommand,
        [date, color, significance, userId],
        function (err, res) {
          if (err) {
            return reject(
              new DatabaseError(
                `Unable to set important date. Date [${date}]. Error [${err.message}]`
              )
            );
          }
          /**
           * TODO: Handle empty rows
           */
          console.log(
            `Important date added [${res.rows[0].id}]. User [${res.rows[0].user_id}]`
          );
          resolve({ ...res.rows[0] });
        }
      );
    });
  });
};

module.exports = ImportantDatesController;
