const express = require("express");
const router = express.Router();
const { ROUTE_PATHS } = require("../utils/constants");
const ImportantDatesService = require("../db/ImportantDates");
const AuthService = require("../middleware/auth");
const UserService = require("../db/User");

module.exports = (db) => {
  const importantDatesService = new ImportantDatesService(db);
  const userService = new UserService(db);
  const authService = new AuthService(db);

  router.post(
    ROUTE_PATHS.DATES.ADD_DATES,
    (...args) => authService.isAuthenticated(...args),
    async (req, res) => {
      try {
        const { id } = req.session.user;
        await importantDatesService.checkImportantDatesCount(id);
        const results = await Promise.allSettled(
          importantDatesService.addImportantDates(id, req.body.dates)
        );
        res.status(200).json({
          success: true,
          dates: results.map((result) => {
            const date = { ...result };
            if (result.status === "rejected") {
              date.value = {};
              if (result.reason instanceof Error) {
                date.reason = result.reason.message;
                date.value.date = result.reason.date;
                date.value.color = result.reason.color;
                date.value.significance = result.reason.significance;
              }
            }
            return date;
          })
        });
      } catch (e) {
        res.status(400).json({
          errorMessage: `${e.code} : ${e.message}`
        });
      }
    }
  );

  router.get(
    ROUTE_PATHS.DATES.GET_DATES,
    (...args) => authService.isAuthenticated(...args),
    async (req, res) => {
      try {
        const { id } = req.session.user;
        const result = await importantDatesService.getImportantDates(id);
        res.status(200).json({
          success: true,
          dates: result
        });
      } catch (e) {
        res.status(400).json({
          errorMessage: `${e.code} : ${e.message}`
        });
      }
    }
  );

  router.delete(
    ROUTE_PATHS.DATES.DELETE_DATES,
    (...args) => authService.isAuthenticated(...args),
    async (req, res) => {
      const { id } = req.session.user;
      const dateIds = req.body.dateIds;
      try {
        const results = await Promise.allSettled(
          await importantDatesService.removeImportantDates(id, dateIds)
        );
        res.status(200).json({
          success: true,
          dates: results.map((result) => {
            const date = { ...result };
            if (result.status === "rejected") {
              date.value = null;
              if (result.reason instanceof Error) {
                date.reason = result.reason.message;
                date.value = result.reason.id;
              }
            }
            return date;
          })
        });
      } catch (e) {
        res.status(400).json({
          errorMessage: `${e.code} : ${e.message}`
        });
      }
    }
  );

  router.get(
    ROUTE_PATHS.DATES.MAX_DATES,
    (...args) => authService.isAuthenticated(...args),
    async (req, res) => {
      try {
        const tier = await userService.getUserTier(req.session.user.id);
        const maxDates = await ImportantDatesService.MAX_IMPORTANT_DATES[tier];
        res.status(200).json({
          success: true,
          dates: {
            maxDates
          }
        });
      } catch (e) {
        res.status(400).json({
          errorMessage: `${e.code} : ${e.message}`
        });
      }
    }
  );

  return router;
};
