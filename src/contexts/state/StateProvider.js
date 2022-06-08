import React, { createContext, useReducer, useEffect, useState } from "react";
import Reducer from "./Reducer";
import LoadingBar from "../../components/LoadingBar";
import { actions } from "./Actions";
import { StateHandler } from "./StateRoutes";
import { useAuth } from "../auth/AuthProvider";

const context = createContext(null);

const StateProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const initialState = {
    user: {
      dateOfBirth: new Date().toISOString().split("T")[0],
      isUserSet: (currentUser && currentUser.isUserSet) || false
    },
    importantDates: [],
    error: "",
    maxDates: 80
  };
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [loading, setLoading] = useState(true);
  const stateHandler = new StateHandler();

  const stateManagement = stateHandler.initialize({
    databaseURL: `${process.env.API_SERVER_URL}`
  });

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    (async () => {
      if (isMounted) {
        try {
          const { dates } = await stateManagement.getImportantDates();
          const {
            dates: { maxDates }
          } = await stateManagement.getMaxDates();
          dispatch(actions.setUser(currentUser));
          dispatch(actions.getImportantDates(dates));
          dispatch(actions.getMaxDates(maxDates));
        } catch (e) {
          dispatch(actions.gotError(e.message));
        } finally {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const getUserTier = async () => {
    /**
     * We dont want to store this in state just yet
     * since we dont want a user to manipulate it
     */
    try {
      return await stateManagement.getUserTier();
    } catch (e) {
      dispatch(actions.gotError(e.message));
    }
  };

  const getImportantDates = async () => {
    try {
      const res = await stateManagement.getImportantDates();
      dispatch(actions.getImportantDates(res.dates));
    } catch (e) {
      dispatch(actions.gotError(e.message));
    }
  };

  const addImportantDates = async (importantDates) => {
    try {
      const res = await stateManagement.setImportantDates(importantDates);
      const rejected = {};
      const fulfilled = [];
      res.dates.forEach((date) => {
        if (date.status === "rejected") {
          rejected[date.reason] = date.value.date;
        } else {
          fulfilled.push(date);
        }
      });
      const errorStrings = [];
      Object.entries(rejected).map((entry) => {
        errorStrings.push(`${entry[0]} [${entry[1]}]`);
      });
      dispatch(actions.addImportantDates(fulfilled));
      dispatch(actions.gotError(errorStrings.join("\n")));
    } catch (e) {
      dispatch(actions.gotError(e.message));
    }
  };

  const removeImportantDates = async (dateIds) => {
    try {
      const res = await stateManagement.removeImportantDates(dateIds);
      const rejected = {};
      const fulfilled = [];
      res.dates.forEach((date) => {
        if (date.status === "rejected") {
          rejected[date.reason] = date.value.id;
        } else {
          fulfilled.push(date);
        }
      });
      const errorStrings = [];
      Object.entries(rejected).map((entry) => {
        errorStrings.push(`${entry[0]} [${entry[1]}]`);
      });
      dispatch(actions.removeImportantDates(fulfilled));
      dispatch(actions.gotError(errorStrings.join("\n")));
    } catch (e) {
      dispatch(actions.gotError(e.message));
    }
  };

  const setUser = async (userChanges) => {
    try {
      const res = await stateManagement.setUser({
        user: {
          id: currentUser.id,
          isUserSet: currentUser.isUserSet,
          dateOfBirth: currentUser.dateOfBirth,
          ...userChanges?.user
        }
      });
      dispatch(actions.setUser(res.user));
    } catch (e) {
      dispatch(actions.gotError(e.message));
    }
  };

  const value = {
    importantDates: state.importantDates,
    user: state.user,
    maxDates: state.maxDates,
    loading,
    error: state.error,
    getImportantDates,
    addImportantDates,
    removeImportantDates,
    setUser,
    getUserTier
  };
  return (
    <context.Provider value={value}>
      {loading ? (
        <div className="container">
          <div className="content-block">
            <LoadingBar />
          </div>
        </div>
      ) : (
        children
      )}
    </context.Provider>
  );
};

StateProvider.context = context;

export default StateProvider;
