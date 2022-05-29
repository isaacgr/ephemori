import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Alert from "@mui/material/Alert";
import { useAuth } from "../contexts/auth/AuthProvider";

const ForgotPassword = () => {
  const emailRef = useRef();
  const { requestResetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await requestResetPassword(emailRef.current.value);
      setMessage(
        "Check your inbox for the next steps.\
        If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address."
      );
    } catch (e) {
      setError(`Failed to reset password: ${e.message}`);
    }
    setLoading(false);
  };
  return (
    <div className="container">
      <div className="content-block">
        <Paper className="auth-page auth-page__pw-reset" variant="outlined">
          <div className="content-block">
            <Typography variant="h4">Password Reset</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
          </div>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormGroup className="content-block">
                <TextField
                  type="email"
                  required
                  label="Email"
                  variant="standard"
                  inputRef={emailRef}
                />
              </FormGroup>
              <FormGroup className="content-block">
                <Button variant="contained" disabled={loading} type="submit">
                  Request Password Reset
                </Button>
              </FormGroup>
            </FormControl>
          </form>
          <div className="content-block">
            <Typography variant="subtitle1">
              <Link to="/login">Log In</Link>
            </Typography>
          </div>
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

export default ForgotPassword;
