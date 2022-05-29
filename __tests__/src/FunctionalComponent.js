import React, { useContext } from "react";
import { useAuth } from "../../src/contexts/auth/AuthProvider";
import StateProvider from "../../src/contexts/state/StateProvider";

const AuthTestingComponent = () => {
  const { currentUser, error } = useAuth();
  return (
    <>
      <p>{error}</p>
      <p>{currentUser?.userId}</p>
      <p>{currentUser?.email}</p>
      <p>{currentUser?.displayName}</p>
      <p>{currentUser?.dateOfBirth}</p>
      <p>{currentUser?.isUserSet}</p>
      <p>{currentUser?.isUserSet}</p>
    </>
  );
};

const StateTestingComponent = () => {
  const state = useContext(StateProvider.context);
  return (
    <>
      <p>{state.error}</p>
      <p>{state.importantDates}</p>
      <p>{state.maxDates}</p>
    </>
  );
};

export { AuthTestingComponent, StateTestingComponent };
