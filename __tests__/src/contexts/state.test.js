/** @jest-environment jsdom */
import React from "react";
import { StateHandler } from "../../../src/contexts/state/StateRoutes";
import StateProvider from "../../../src/contexts/state/StateProvider";
import * as Auth from "../../../src/contexts/auth/AuthProvider";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { StateTestingComponent } from "../FunctionalComponent";
import "@testing-library/jest-dom/extend-expect";

const user = {
  userId: 1,
  email: "testsuite@email.com",
  displayName: null,
  dateOfBirth: "1992-01-29",
  isUserSet: true
};

jest.spyOn(Auth, "useAuth").mockImplementation(() => {
  return {
    currentUser: user
  };
});

describe("<StateProvider/>", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("it should initialize the StateHandler", async () => {
    const initializeSpy = jest.spyOn(StateHandler.prototype, "initialize");
    render(
      <Auth.AuthProvider>
        <StateProvider>
          <StateTestingComponent />
        </StateProvider>
      </Auth.AuthProvider>
    );
    await waitFor(() => {
      expect(initializeSpy).toHaveBeenCalled();
    });
  });
  test("it should fetch the important dates on load", async () => {
    const getImportantDatesSpy = jest
      .spyOn(StateHandler.prototype, "getImportantDates")
      .mockImplementation(() => Promise.resolve({ dates: ["dateInfo"] }));
    jest
      .spyOn(StateHandler.prototype, "getMaxDates")
      .mockImplementation(() => Promise.resolve({ dates: { maxDates: 80 } }));
    render(
      <Auth.AuthProvider>
        <StateProvider>
          <StateTestingComponent />
        </StateProvider>
      </Auth.AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("dateInfo")).toBeInTheDocument();
    });
    expect(getImportantDatesSpy).toHaveBeenCalled();
  });
  test("it should get the max allowable important dates", async () => {
    const getMaxDatesSpy = jest
      .spyOn(StateHandler.prototype, "getMaxDates")
      .mockImplementation(() => Promise.resolve({ maxDates: 80 }));
    render(
      <Auth.AuthProvider>
        <StateProvider>
          <StateTestingComponent />
        </StateProvider>
      </Auth.AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("80")).toBeInTheDocument();
    });
    expect(getMaxDatesSpy).toHaveBeenCalled();
  });
  test("it pass an error to the child component with no user info", async () => {
    const getImportantDatesSpy = jest
      .spyOn(StateHandler.prototype, "getImportantDates")
      .mockImplementation(() => Promise.reject(new Error("No Dates")));
    render(
      <Auth.AuthProvider>
        <StateProvider>
          <StateTestingComponent />
        </StateProvider>
      </Auth.AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("No Dates")).toBeInTheDocument();
    });
    expect(getImportantDatesSpy).toHaveBeenCalled();
  });
  test("it should display loading screen if data has not yet resolved", async () => {
    render(
      <Auth.AuthProvider>
        <StateProvider>
          <StateTestingComponent />
        </StateProvider>
      </Auth.AuthProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
  });
});
