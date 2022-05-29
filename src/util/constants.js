export const colors = [
  "#E76F51",
  "#0047ab",
  "#990000",
  "#228b22",
  "#A9A9A9",
  "#BFFF00",
  "#FFA500",
  "#FF69B4",
  "#EE82EE",
  "#F4C430",
  "#87CEEB",
  "#353935",
  "#FFD700",
  "#E5E4E2",
  "#B76E79",
  "#BBA58E",
  "#FFFFFF",
  "#0060FF",
  "#FC540C",
  "#600CFC",
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#00FFFF",
  "#FF00FF",
  "#C0C0C0",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#800080",
  "#008080",
  "#000080"
];

export const HttpMethod = {
  POST: "POST",
  GET: "GET",
  DELETE: "DELETE",
  PATCH: "PATCH"
};

export const HttpHeader = {
  CONTENT_TYPE: "Content-Type"
};
export const DEFAULT_API_TIMEOUT_MS = 30000;

export const Endpoint = {
  SIGN_UP: "/v1/accounts/signUp",
  LOGIN: "/v1/accounts/login",
  LOGOUT: "/v1/accounts/logout",
  EMAIL_VERIFICATION: "/v1/accounts/verifySignup",
  GET_ACCOUNT_INFO: "/v1/accounts/lookup",
  RESET_PASSWORD: "/v1/accounts/resetPassword",
  RESET_VERIFICATION: "/v1/accounts/verifyReset",
  SET_USER: "/v1/user",
  SET_IMPORTANT_DATES: "/v1/dates",
  GET_IMPORTANT_DATES: "/v1/dates",
  DELETE_IMPORTANT_DATE: "/v1/dates",
  MAX_DATES: "/v1/dates/maxDates"
};

export const AuthErrorCode = {
  EMAIL_EXISTS: "email-already-in-use",
  NETWORK_REQUEST_FAILED: "network-request-failed"
};

/**
 * Errors that can be returned by the backend
 */
export const SERVER_ERROR_MAP = {
  EMAIL_EXISTS: "EMAIL_EXISTS",
  NETWORK_REQUEST_FAILED: "REQUEST_FAILED"
};
