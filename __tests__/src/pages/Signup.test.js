/** @jest-environment jsdom */
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import * as Auth from "../../../src/contexts/auth/AuthProvider";
import renderer from "react-test-renderer";
import Signup from "../../../src/pages/Signup";

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

describe("<Signup/>", () => {
  it("should render correctly when loaded", () => {
    const login = renderer
      .create(
        <Router>
          <Signup />
        </Router>
      )
      .toJSON();
    expect(login).toMatchSnapshot();
  });
});
