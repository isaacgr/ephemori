import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Alert from "@mui/material/Alert";
import { useAuth } from "../contexts/auth/AuthProvider";
import { useQuery } from "../hooks/useQuery";
import LoadingBar from "../components/LoadingBar";
import FormButton from "../components/FormButton";

const PasswordReset = () => {
  const { checkResetTokenValid, resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetResponse, setResetResponse] = useState("");
  const [passwordRef, setPasswordRef] = useState("");
  const [passwordConfirmRef, setPasswordConfirmRef] = useState("");
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
        await checkResetTokenValid(userId, token);
        if (isMounted) {
          setLoadingPage(true);
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message);
          setLoadingPage(false);
        }
      } finally {
        if (isMounted) {
          setLoadingPage(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef !== passwordConfirmRef) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      const userId = query.get("userId");
      const token = query.get("token");
      const response = await resetPassword(userId, token, passwordRef);
      setResetResponse(response.message);
    } catch (e) {
      setResetResponse("");
      setError(`Failed to reset password: ${e.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="content-block">
        {loadingPage ? (
          <LoadingBar />
        ) : (
          <>
            <Paper className="auth-page auth-page__reset" variant="outlined">
              {error && <Alert severity="error">{error}</Alert>}
              {resetResponse && (
                <Alert severity="success">{resetResponse}</Alert>
              )}
              <form onSubmit={handleSubmit}>
                <FormControl>
                  <FormGroup className="content-block">
                    <TextField
                      type="password"
                      required
                      label="New Password"
                      variant="standard"
                      value={passwordRef}
                      onChange={(e) => setPasswordRef(e.target.value)}
                    />
                    <TextField
                      type="password"
                      required
                      label="Confirm New Password"
                      variant="standard"
                      value={passwordConfirmRef}
                      onChange={(e) => setPasswordConfirmRef(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="content-block">
                    <FormButton buttonText="Submit" loading={loading} />
                  </FormGroup>
                </FormControl>
              </form>
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

export default PasswordReset;
