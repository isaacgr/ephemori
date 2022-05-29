/** @jest-environment jsdom */
import React from "react";
import { AuthHandler } from "../../../src/contexts/auth/AuthHandler";
import { AuthProvider } from "../../../src/contexts/auth/AuthProvider";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { AuthTestingComponent } from "../FunctionalComponent";
import "@testing-library/jest-dom/extend-expect";

const user = {
  userId: 1,
  email: "testsuite@email.com",
  displayName: null,
  dateOfBirth: "1992-01-29",
  isUserSet: true
};

describe("<AuthProvider/>", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("it should initialize the AuthHandler", async () => {
    const initializeSpy = jest.spyOn(AuthHandler.prototype, "initialize");
    render(
      <AuthProvider>
        <AuthTestingComponent />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(initializeSpy).toHaveBeenCalled();
    });
  });
  test("it should check if the user is authenticated and provide expected value to child elements", async () => {
    const checkAuthenticatedSpy = jest
      .spyOn(AuthHandler.prototype, "checkAuthenticated")
      .mockImplementation(() => Promise.resolve({ user }));
    render(
      <AuthProvider>
        <AuthTestingComponent />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(user.userId)).toBeInTheDocument();
    });
    expect(checkAuthenticatedSpy).toHaveBeenCalled();
  });
  test("it pass an error to the child component with no user info", async () => {
    const checkAuthenticatedSpy = jest
      .spyOn(AuthHandler.prototype, "checkAuthenticated")
      .mockImplementation(() => Promise.reject(new Error("Unauthenticated")));
    render(
      <AuthProvider>
        <AuthTestingComponent />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Unauthenticated")).toBeInTheDocument();
      expect(screen.queryByText(user.userId)).not.toBeInTheDocument();
    });
    expect(checkAuthenticatedSpy).toHaveBeenCalled();
  });
  test("it should display loading screen if data has not yet resolved", async () => {
    render(
      <AuthProvider>
        <AuthTestingComponent />
      </AuthProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
  });
});
