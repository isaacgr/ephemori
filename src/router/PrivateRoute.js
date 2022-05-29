import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthProvider";
import StateProvider from "../contexts/state/StateProvider";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? (
    <StateProvider>{children}</StateProvider>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
