class AlreadyVerifiedError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "ALREADY_VERIFIED_ERROR";
  }
}

class NoSuchUserError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "NO_SUCH_USER";
  }
}

class UserNotVerifiedError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "USER_NOT_VERIFIED_ERROR";
  }
}

class InvalidTokenError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "INVALID_TOKEN_ERROR";
  }
}

class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "INVALID_CREDENTIALS_ERROR";
  }
}

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "UNAUTHENTICATED_ERROR";
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "DATABASE_ERROR";
  }
}

class InvalidEmailFormatError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "INVALID_EMAIL_FORMAT_ERROR";
  }
}

class DateError extends Error {
  constructor(message, dateParams) {
    super(message);
    this.message = message;
    this.code = "DATE_ERROR";
    if (dateParams) {
      const { id, date, color, significance } = dateParams;
      this.id = id;
      this.date = date;
      this.color = color;
      this.significance = significance;
    }
  }
}

class UserError extends Error {
  constructor(message, userParams) {
    super(message);
    this.message = message;
    this.code = "USER_ERROR";
    if (userParams) {
      const { dateOfBirth, id } = userParams;
      this.id = id;
      this.dateOfBirth = dateOfBirth;
    }
  }
}

class SetUserError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.code = "SET_USER_ERROR";
  }
}

module.exports = {
  AlreadyVerifiedError,
  InvalidTokenError,
  InvalidCredentialsError,
  UnauthenticatedError,
  DatabaseError,
  InvalidEmailFormatError,
  SetUserError,
  DateError,
  UserNotVerifiedError,
  NoSuchUserError,
  UserError
};
