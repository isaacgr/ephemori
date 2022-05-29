/** @jest-environment jsdom */
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import * as Auth from "../../../src/contexts/auth/AuthProvider";
import renderer from "react-test-renderer";
import Login from "../../../src/pages/Login";

const user = {
  userId: 1,
  email: "testsuite@email.com",
  displayName: null,
  dateOfBirth: "1992-01-29",
  isUserSet: true
};

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate
}));

jest.spyOn(Auth, "useAuth").mockImplementation(() => {
  return {
    currentUser: user
  };
});

describe("<Login/>", () => {
  it("should render correctly when loaded", () => {
    const login = renderer
      .create(
        <Router>
          <Login />
        </Router>
      )
      .toJSON();
    expect(login).toMatchSnapshot();
  });
});
