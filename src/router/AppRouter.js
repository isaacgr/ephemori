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
import Login from "../pages/Login";
const history = createBrowserHistory();

import SettingsPage from "../pages/SettingsPage";
import MainPage from "../pages/MainPage";
import NotFound from "../pages/NotFound";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import PasswordReset from "../pages/PasswordReset";
import VerifyEmail from "../pages/VerifyEmail";

const AppRouter = () => {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeProvider theme={createTheme(getDesignTokens(theme))}>
      <Router history={history}>
        <AuthProvider>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route index exact path="/" element={<Navigate to="/my-grid" />} />
            <Route exact path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-grid"
              element={
                <PrivateRoute>
                  <MainPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;
