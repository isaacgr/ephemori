import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import LoadingBar from "../components/LoadingBar";
import { useAuth } from "../contexts/auth/AuthProvider";
import { useQuery } from "../hooks/useQuery";

const VerifyEmail = () => {
  const { verifySignupRequest } = useAuth();
  const [signupResponse, setSignupResponse] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const query = useQuery();

  useEffect(() => {
    if (!query.get("userId") || !query.get("token")) {
      return;
    }
    let isMounted = true;
    const userId = query.get("userId");
    const token = query.get("token");
    (async () => {
      try {
        if (isMounted) {
          setLoading(true);
          const response = await verifySignupRequest(userId, token);
          if (response.message) {
            setSignupResponse(response.message);
          } else {
            console.log("No response for the verification");
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

  return (
    <div className="container">
      <div className="content-block">
        {loading ? (
          <LoadingBar />
        ) : (
          <>
            <Paper className="auth-page auth-page__verify" variant="outlined">
              <div className="content-block">
                {error && <Alert severity="error">{error}</Alert>}
                {signupResponse && (
                  <Alert severity="success">{signupResponse}</Alert>
                )}
              </div>
            </Paper>
            <div className="content-block">
              <Typography variant="subtitle1">
                <Link to="/login">Log In</Link>
              </Typography>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
