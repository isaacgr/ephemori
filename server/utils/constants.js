const ROUTE_PATHS = {
  ACCOUNTS: {
    SIGN_UP: "/accounts/signUp",
    EMAIL_VERIFICATION: "/accounts/verifySignup",
    LOGIN: "/accounts/login",
    LOGOUT: "/accounts/logout",
    PASSWORD_RESET: "/accounts/resetPassword",
    RESET_VERIFICATION: "/accounts/verifyReset",
    GET_ACCOUNT_INFO: "/accounts/lookup"
  },
  DATES: {
    ADD_DATES: "/dates",
    DELETE_DATES: "/dates",
    GET_DATES: "/dates",
    MAX_DATES: "/dates/maxDates"
  },
  USER: {
    SET_USER: "/user"
  }
};

module.exports = { ROUTE_PATHS };
