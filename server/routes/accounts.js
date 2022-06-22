const express = require("express");
const router = express.Router();
const isValidEmail = require("../utils/isValidEmail");
const UserService = require("../db/User");
const TokenService = require("../db/Token");
const { ROUTE_PATHS } = require("../utils/constants");
const { InvalidEmailFormatError } = require("../utils/errors");
const sendEmail = require("../email/mailer");
const AuthService = require("../middleware/auth");

module.exports = (db) => {
  const userService = new UserService(db);
  const tokenService = new TokenService(db);
  const authService = new AuthService(db);

  router.post(ROUTE_PATHS.ACCOUNTS.SIGN_UP, async (req, res) => {
    const userInfo = {
      credentials: {
        email: req.body.email,
        password: req.body.password
      }
    };

    try {
      if (!isValidEmail(userInfo.credentials.email)) {
        throw new InvalidEmailFormatError("Invalid email format");
      }
      const userId = await userService.createUser(userInfo);
      const token = await tokenService.createVerifyToken(userId);
      await sendEmail(
        userInfo.credentials.email,
        "Verify your account with ephemori",
        {
          link: `${process.env.FRONTEND_URL}/verify-email?userId=${userId}&token=${token}`
        },
        "../email/templates/signUp.handlebars"
      );
      res.status(201).json({
        success: true,
        message: "An email has been sent to verify your account."
      });
    } catch (e) {
      /**
       * TODO:
       * Delete the user from the database if it exists at this point.
       * Avoids erroneous/stale data.
       */
      res.status(400).json({
        errorMessage: `${e.code} : ${e.message}`
      });
    }
  });

  router.get(ROUTE_PATHS.ACCOUNTS.EMAIL_VERIFICATION, async (req, res) => {
    try {
      const token = req.query.token;
      await userService.verifyUser(token);
      res.json({
        success: true,
        message: "Email verified successfully."
      });
    } catch (e) {
      res.status(400).json({
        errorMessage: `${e.code} : ${e.message}`
      });
    }
  });

  router.post(
    ROUTE_PATHS.ACCOUNTS.LOGIN,
    (...args) => authService.isUserVerified(...args),
    async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await userService.getUserByCredentials(email, password);
        req.session.user = user;
        res.status(200).json({
          success: true,
          user
        });
      } catch (e) {
        res.status(400).json({
          errorMessage: `${e.code} : ${e.message}`
        });
      }
    }
  );

  router.get(
    ROUTE_PATHS.ACCOUNTS.GET_ACCOUNT_INFO,
    (...args) => authService.isAuthenticated(...args),
    async (req, res) => {
      try {
        /**
         * TODO: isAuthenticated already calls getUserById
         * Maybe can pass user back from middleware?
         */
        const user = await userService.getUserById(req.session.user.id);
        res.status(200).json({ success: true, user });
      } catch (e) {
        res.status(401).json({
          errorMessage: `${e.code} : ${e.message}`
        });
      }
    }
  );

  router.get(
    ROUTE_PATHS.ACCOUNTS.LOGOUT,
    (...args) => authService.isAuthenticated(...args),
    async (req, res) => {
      try {
        req.session.destroy((err) => {
          if (err) {
            console.log(`Unable to destroy session. Error [${err}].`);
          }
          /**
           * TODO:
           * How should the error be handled?
           */
          res.redirect("/");
        });
      } catch (e) {
        /**
         * TODO: Should the user be redirected regardles?
         */
        res.status(401).json({
          errorMessage: `${e.code} : ${e.message}`
        });
      }
    }
  );

  router.post(ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET, async (req, res) => {
    try {
      const email = req.body.email;
      const { id } = await userService.getUserByEmail(email);
      const token = await tokenService.createResetToken(id);
      await sendEmail(
        email,
        "Reset your ephemori password",
        {
          link: `${process.env.FRONTEND_URL}/password-reset?userId=${id}&token=${token}`
        },
        "../email/templates/requestResetPassword.handlebars"
      );
      res.status(200).json({
        success: true,
        message: "An email has been sent to reset your password."
      });
    } catch (e) {
      res.status(400).json({
        errorMessage: `${e.code} : ${e.message}`
      });
    }
  });

  router.get(ROUTE_PATHS.ACCOUNTS.RESET_VERIFICATION, async (req, res) => {
    const { userId, token } = req.query;
    try {
      await tokenService.getResetToken(userId, token);
      res.json({
        success: true,
        message: "Reset request verified."
      });
    } catch (e) {
      res.status(400).json({
        errorMessage: `${e.code} : ${e.message}`
      });
    }
  });

  router.patch(ROUTE_PATHS.ACCOUNTS.PASSWORD_RESET, async (req, res) => {
    const { id, token, password } = req.body;
    try {
      await tokenService.getResetToken(id, token);
      await userService.updatePassword({ id, password });
      try {
        await tokenService.deleteResetToken(id, token);
      } catch (e) {
        console.log(`Unable to delete token. [${e.message}]`);
      }
      res.json({
        success: true,
        message: "Password has been updated."
      });
    } catch (e) {
      res.status(400).json({
        errorMessage: `${e.code} : ${e.message}`
      });
    }
  });

  return router;
};
