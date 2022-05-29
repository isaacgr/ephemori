import { HttpMethod, Endpoint } from "../../util/constants";
import { performApiRequest } from "../../util/functions";

export class AuthHandler {
  initialize(connectionSettings) {
    const { databaseURL } = connectionSettings;
    this.databaseURL = databaseURL;
    if (!(this instanceof AuthHandler)) {
      return new AuthHandler();
    } else {
      return this;
    }
  }

  async createUserWithEmailAndPassword(email, password) {
    return await performApiRequest(this, HttpMethod.POST, Endpoint.SIGN_UP, {
      email,
      password
    });
  }

  async signInWithEmailAndPassword(email, password) {
    return await performApiRequest(this, HttpMethod.POST, Endpoint.LOGIN, {
      email,
      password
    });
  }

  async checkAuthenticated() {
    return await performApiRequest(
      this,
      HttpMethod.GET,
      Endpoint.GET_ACCOUNT_INFO
    );
  }

  async verifySignupRequest(id, token) {
    return await performApiRequest(
      this,
      HttpMethod.GET,
      Endpoint.EMAIL_VERIFICATION,
      {
        id,
        token
      }
    );
  }

  async requestResetPassword(email) {
    return await performApiRequest(
      this,
      HttpMethod.POST,
      Endpoint.RESET_PASSWORD,
      { email }
    );
  }

  async resetPassword(id, token, password) {
    return await performApiRequest(
      this,
      HttpMethod.PATCH,
      Endpoint.RESET_PASSWORD,
      { id, token, password }
    );
  }

  async checkResetToken(id, token) {
    return await performApiRequest(
      this,
      HttpMethod.GET,
      Endpoint.RESET_VERIFICATION,
      {
        userId: id,
        token
      }
    );
  }

  async signOut() {
    return await performApiRequest(this, HttpMethod.GET, Endpoint.LOGOUT);
  }

  async setImportantDates(importantDates) {
    return await performApiRequest(
      this,
      HttpMethod.POST,
      Endpoint.SET_IMPORTANT_DATES,
      { importantDates }
    );
  }
}
