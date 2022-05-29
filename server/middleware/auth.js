const {
  UnauthenticatedError,
  UserNotVerifiedError
} = require("../utils/errors");
const UserService = require("../db/User");
const SessionService = require("../db/Session");

class AuthService {
  constructor(db) {
    this.db = db;
  }

  get userService() {
    return this.UserService;
  }

  set userService(service) {
    this.UserService = service;
  }

  get sessionService() {
    return this.SessionService;
  }

  set sessionService(service) {
    this.SessionService = service;
  }

  async isAuthenticated(req, res, next) {
    this.userService = new UserService(this.db);
    this.sessionService = new SessionService(this.db);
    try {
      if (
        !req.session ||
        !req.session.user ||
        !req.cookies ||
        !req.cookies["connect.sid"]
      ) {
        throw new UnauthenticatedError("User is not authenticated");
      }
      await this.userService.getUserById(req.session.user.id);
      /**
       * TODO: Do i even need to do this? Does the middleware handle it?
       */
      // await this.sessionService.getSession(
      //   req.cookies["connect.sid"].split(":")[1].split(".")[0]
      // );
      next();
    } catch (e) {
      res.status(401).json({
        errorMessage: `${e.code} : ${e.message}`
      });
    }
  }

  async isUserVerified(req, res, next) {
    this.userService = new UserService(this.db);
    try {
      const verified = await this.userService.getUserVerfied(req.body.email);
      if (!verified) {
        throw new UserNotVerifiedError("User has not verified their account");
      }
      next();
    } catch (e) {
      res.status(401).json({
        errorMessage: `${e.code} : ${e.message}`
      });
    }
  }
}

module.exports = AuthService;
