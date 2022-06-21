import React, { useState } from "react";
import { AuthProvider } from "../contexts/auth/AuthProvider";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "@mui/material/styles";
import { getDesignTokens } from "../theme/Theme";
import { createTheme } from "@mui/material/styles";
import PrivateRoute from "./PrivateRoute";
import ContextRoute from "./ContextRoute";
import CssBaseline from "@mui/material/CssBaseline";
const history = createBrowserHistory();

import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";
import SettingsPage from "../pages/SettingsPage";
import MainPage from "../pages/MainPage";
import NotFoundPage from "../pages/NotFoundPage";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import PasswordReset from "../pages/PasswordReset";
import VerifyEmail from "../pages/VerifyEmail";

import PrivacyPolicy from "../policy-pages/PrivacyPolicy";
import TermsAndConditions from "../policy-pages/TermsAndConditions";
import CookiePolicy from "../policy-pages/CookiePolicy";
import Contact from "../pages/Contact";

import Footer from "../components/Footer";

const AppRouter = () => {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeProvider theme={createTheme(getDesignTokens(theme))}>
      <CssBaseline enableColorScheme />
      <Router history={history}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route index exact path="/" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route
            exact
            path="/login"
            element={
              <ContextRoute contextProvider={AuthProvider}>
                <Login />
              </ContextRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ContextRoute contextProvider={AuthProvider}>
                <Signup />
              </ContextRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ContextRoute contextProvider={AuthProvider}>
                <ForgotPassword />
              </ContextRoute>
            }
          />
          <Route
            path="/password-reset"
            element={
              <ContextRoute contextProvider={AuthProvider}>
                <PasswordReset />
              </ContextRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <ContextRoute contextProvider={AuthProvider}>
                <VerifyEmail />
              </ContextRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ContextRoute contextProvider={AuthProvider}>
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              </ContextRoute>
            }
          />
          <Route
            path="/my-grid"
            element={
              <ContextRoute contextProvider={AuthProvider}>
                <PrivateRoute>
                  <MainPage />
                </PrivateRoute>
              </ContextRoute>
            }
          />
        </Routes>
      </Router>
      <Footer />
    </ThemeProvider>
  );
};

export default AppRouter;
