/** @jest-environment jsdom */
import { SERVER_ERROR_MAP } from "../../../src/util/constants";
import { NetworkTimeoutError } from "../../../src/util/errors";
import {
  isObject,
  queryString,
  performApiRequest,
  performFetchWithErrorHandling,
  NetworkTimeout
} from "../../../src/util/functions";

describe("functions", () => {
  describe("isObject", () => {
    it("should return true if value passed is an object", () => {
      expect(isObject({ foo: "bar" })).toBe(true);
    });
    it("should return false if value passed is an array", () => {
      expect(isObject([1, 2, 3])).toBe(false);
    });
    it("should return false if value passed is a string", () => {
      expect(isObject("test")).toBe(false);
    });
    it("should return false if value passed is a number", () => {
      expect(isObject(1)).toBe(false);
    });
  });
  describe("queryString", () => {
    it("should return a querystring-formatted string given an dict", () => {
      const string = queryString({ arg: "val", arg2: "val2" });
      expect(string).toBe("&arg=val&arg2=val2");
    });
  });
  describe("NetworkTimeout", () => {
    it("should reject the promise after the given timeout", async () => {
      const networkTimeout = new NetworkTimeout(1);
      const e = async () => {
        await networkTimeout.promise;
      };
      await expect(e()).rejects.toThrow(NetworkTimeoutError);
      await expect(e()).rejects.toThrow("Network request timed out");
      await expect(e()).rejects.toHaveProperty(
        "code",
        SERVER_ERROR_MAP.NETWORK_REQUEST_FAILED
      );
    });
    it("should assign the timer to a class attribute", async () => {
      const networkTimeout = new NetworkTimeout(1);
      const e = async () => {
        await networkTimeout.promise;
      };
      await expect(e()).rejects.toThrow(NetworkTimeoutError);
      expect(networkTimeout.timer).not.toBe(null);
    });
    it("should clear the timer", async () => {
      const networkTimeout = new NetworkTimeout(1);
      const e = async () => {
        await networkTimeout.promise;
      };
      await expect(e()).rejects.toThrow(NetworkTimeoutError);
      expect(networkTimeout.timer).not.toBe(null);
      networkTimeout.clearNetworkTimeout();
      expect(typeof networkTimeout.timer === "number").toBe(true);
    });
  });
});
