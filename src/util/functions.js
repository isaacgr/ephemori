import {
  DEFAULT_API_TIMEOUT_MS,
  HttpMethod,
  HttpHeader,
  SERVER_ERROR_MAP
} from "./constants";
import { ServerError, NetworkTimeoutError } from "./errors";

/**
 * Determine if a particular value is an object
 *
 * @param {object} val Object to evaluate
 * @returns {bool} True if value is an object, false otherwise
 */
export const isObject = (val) => {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
};

/**
 * Returns a querystring-formatted string (e.g. &arg=val&arg2=val2) from a
 * params object (e.g. {arg: 'val', arg2: 'val2'})
 * Note: You must prepend it with ? when adding it to a URL.
 */
export const queryString = (querystringParams) => {
  const params = [];
  for (const [key, value] of Object.entries(querystringParams)) {
    if (Array.isArray(value)) {
      value.forEach((arrayVal) => {
        params.push(
          encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal)
        );
      });
    } else {
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
  }
  return params.length ? "&" + params.join("&") : "";
};

/**
 * Helper class to timeout requests
 *
 * Will reject the promise after the given timeout
 *
 * @example
 * const networkTimeout = new NetworkTimeout()
 * await Promise.race([slowNetworkRequest(), networkTimeout.promise]);
 */
export class NetworkTimeout {
  constructor(timeout) {
    this.TIMEOUT = timeout || DEFAULT_API_TIMEOUT_MS;
    this.timer = null;
    this.promise = new Promise((_, reject) => {
      this.timer = setTimeout(() => {
        return reject(
          new NetworkTimeoutError(
            SERVER_ERROR_MAP.NETWORK_REQUEST_FAILED,
            "Network request timed out"
          )
        );
      }, this.TIMEOUT);
    });
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
}

export const performApiRequest = async (auth, method, path, request) => {
  return performFetchWithErrorHandling(async () => {
    let body = {};
    let params = {};
    if (request) {
      if (method === HttpMethod.GET) {
        params = request;
      } else {
        body = {
          body: JSON.stringify(request)
        };
      }
    }

    const query = queryString({
      ...params
    }).slice(1);

    const headers = {
      [HttpHeader.CONTENT_TYPE]: "application/json"
    };
    return fetch(`${auth.databaseURL}/api${path}?${query}`, {
      method,
      headers,
      credentials: "include",
      referrerPolicy: "no-referrer",
      ...body
    });
  });
};

export const performFetchWithErrorHandling = async (fetchFn) => {
  try {
    const networkTimeout = new NetworkTimeout();
    const response = await Promise.race([fetchFn(), networkTimeout.promise]);
    // If we've reached this point, the fetch succeeded and the networkTimeout
    // didn't throw; clear the network timeout delay so that Node won't hang
    networkTimeout.clearNetworkTimeout();
    if (response.ok && response.redirected === true) {
      return { success: true, loggedOut: true };
    }
    const json = await response.json();
    if (response.ok && !("errorMessage" in json)) {
      return json;
    } else {
      const errorMessage = json.errorMessage;
      const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
      throw new ServerError(serverErrorCode, serverErrorMessage);
    }
  } catch (e) {
    if (e instanceof NetworkTimeoutError || e instanceof ServerError) {
      throw e;
    }
    throw new ServerError(SERVER_ERROR_MAP.NETWORK_REQUEST_FAILED, e.message);
  }
};
