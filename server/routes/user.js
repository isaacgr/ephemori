const express = require("express");
const router = express.Router();
const { ROUTE_PATHS } = require("../utils/constants");
const { InvalidCredentialsError } = require("../utils/errors");
const UserService = require("../db/User");
const AuthService = require("../middleware/auth");

module.exports = (db) => {
  const userService = new UserService(db);
  const authService = new AuthService(db);

  router.patch(
    ROUTE_PATHS.USER.SET_USER,
    (...args) => authService.isAuthenticated(...args),
    async (req, res) => {
      try {
        if (!req.body.user) {
          throw new InvalidCredentialsError("Invalid user set request.");
        }
        if (!req.body.user.id) {
          throw new InvalidCredentialsError("Invalid user set request.");
        }
        if (req.session.user.id !== req.body.user.id) {
          throw new InvalidCredentialsError("Invalid user set request.");
        }
        const user = req.body.user;
        const changes = await userService.updateUser(user);
        res.status(200).json({
          user: changes
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
