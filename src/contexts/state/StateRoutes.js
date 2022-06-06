import { HttpMethod, Endpoint } from "../../util/constants";
import { performApiRequest } from "../../util/functions";

export class StateHandler {
  initialize(connectionSettings) {
    const { databaseURL } = connectionSettings;
    this.databaseURL = databaseURL;
    if (!(this instanceof StateHandler)) {
      return new StateHandler();
    } else {
      return this;
    }
  }

  async setImportantDates(importantDates) {
    return await performApiRequest(
      this,
      HttpMethod.POST,
      Endpoint.SET_IMPORTANT_DATES,
      { dates: importantDates }
    );
  }

  async getImportantDates() {
    return await performApiRequest(
      this,
      HttpMethod.GET,
      Endpoint.GET_IMPORTANT_DATES
    );
  }

  async getMaxDates() {
    return await performApiRequest(this, HttpMethod.GET, Endpoint.MAX_DATES);
  }

  async getUserTier() {
    return await performApiRequest(this, HttpMethod.GET, Endpoint.TIER);
  }

  async removeImportantDates(dateIds) {
    return await performApiRequest(
      this,
      HttpMethod.DELETE,
      Endpoint.SET_IMPORTANT_DATES,
      { dateIds }
    );
  }

  async setUser(user) {
    return await performApiRequest(
      this,
      HttpMethod.PATCH,
      Endpoint.SET_USER,
      user
    );
  }
}
