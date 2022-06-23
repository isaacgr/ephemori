import React, { useContext, useState, useEffect } from "react";
import LoadingBar from "../../components/LoadingBar";
import { AuthHandler } from "./AuthHandler";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const authHandler = new AuthHandler();

  const auth = authHandler.initialize({
    databaseURL: `${process.env.API_SERVER_URL}`
  });

  useEffect(async () => {
    let isMounted = true;
    (async () => {
      try {
        if (isMounted) {
          setLoading(true);
          const res = await auth.checkAuthenticated();
          if (res.user) {
            setCurrentUser({
              ...res.user
            });
          } else {
            console.log("No user returned from checkAuthenticated");
          }
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const signup = async (email, password, reRequest) => {
    try {
      const response = await auth.createUserWithEmailAndPassword(
        email,
        password,
        reRequest
      );
      setCurrentUser(response.user);
      return response;
    } catch (e) {
      throw e;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await auth.signInWithEmailAndPassword(email, password);
      setCurrentUser(response.user);
      return response;
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      const response = await auth.signOut();
      return response;
    } catch (e) {
      throw e;
    } finally {
      setCurrentUser(null);
    }
  };

  const verifySignupRequest = async (id, token) => {
    try {
      const response = await auth.verifySignupRequest(id, token);
      return response;
    } catch (e) {
      throw e;
    }
  };

  const requestResetPassword = async (email) => {
    try {
      const response = await auth.requestResetPassword(email);
      return response;
    } catch (e) {
      throw e;
    }
  };

  const resetPassword = async (id, token, password) => {
    try {
      const response = await auth.resetPassword(id, token, password);
      return response;
    } catch (e) {
      throw e;
    }
  };

  const checkResetTokenValid = async (id, token) => {
    try {
      const response = await auth.checkResetToken(id, token);
      return response;
    } catch (e) {
      throw e;
    }
  };

  const value = {
    currentUser,
    error,
    login,
    signup,
    logout,
    verifySignupRequest,
    requestResetPassword,
    resetPassword,
    checkResetTokenValid
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="container">
          <div className="content-block">
            <LoadingBar />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
