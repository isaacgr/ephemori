import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Alert from "@mui/material/Alert";
import { useAuth } from "../contexts/auth/AuthProvider";
import FormButton from "../components/FormButton";
import { useNavigate } from "react-router-dom";
import CookieConsent from "../components/CookieConsent.tsx";

const Login = () => {
  const [emailRef, setEmailRef] = useState("");
  const [passwordRef, setPasswordRef] = useState("");
  const { currentUser, login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isUserSet) {
        navigate("/my-grid");
      } else {
        navigate("/settings");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      if (!cookiesAccepted) {
        throw new Error("Must accept cookies to login");
      }
      const response = await login(emailRef, passwordRef);
      if (response.user.isUserSet) {
        navigate("/my-grid");
      } else {
        navigate("/settings");
      }
    } catch (e) {
      setError(`Failed to log in: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="content-block">
        <Paper className="auth-page auth-page__login" variant="outlined">
          <div className="content-block">
            <Typography variant="h4">Log In</Typography>
            {error && <Alert severity="error">{error}</Alert>}
          </div>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormGroup className="content-block">
                <TextField
                  type="email"
                  required
                  label="Email"
                  variant="standard"
                  value={emailRef}
                  onChange={(e) => setEmailRef(e.target.value)}
                />
                <TextField
                  type="password"
                  required
                  label="Password"
                  variant="standard"
                  value={passwordRef}
                  onChange={(e) => setPasswordRef(e.target.value)}
                />
              </FormGroup>
              <FormGroup className="content-block">
                <FormButton buttonText="Login" loading={loading} />
              </FormGroup>
            </FormControl>
          </form>
          <div className="content-block">
            <Typography variant="subtitle1">
              <Link to="/forgot-password">Forgot Password?</Link>
            </Typography>
          </div>
          <CookieConsent
            onAccept={() => setCookiesAccepted(true)}
            cookieName="cookies-accepted"
          />
        </Paper>
      </div>
      <div className="content-block">
        <Typography variant="subtitle1">
          Need an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </div>
    </div>
  );
};

export default Login;
