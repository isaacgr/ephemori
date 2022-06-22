import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Alert from "@mui/material/Alert";
import FormButton from "../components/FormButton";
import { useAuth } from "../contexts/auth/AuthProvider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Footer from "../components/Footer";

const Signup = () => {
  const [emailRef, setEmailRef] = useState("");
  const [passwordRef, setPasswordRef] = useState("");
  const [passwordConfirmRef, setPasswordConfirmRef] = useState("");
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupResponse, setSignupResponse] = useState({});
  const [agree, setAgree] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const { verificationRequestSent, message } = await signup(
        emailRef,
        passwordRef
      );
      setSignupResponse(() => ({
        verificationRequestSent,
        message
      }));
    } catch (e) {
      setError(`Failed to send email: ${e.message}`);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      return setError(
        "You must agree to the terms and conditions and agree that you have read the privacy policy"
      );
    }
    if (passwordRef !== passwordConfirmRef) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      const { success, message } = await signup(emailRef, passwordRef);
      setSignupResponse(() => ({
        success,
        message
      }));
    } catch (e) {
      setError(`Failed to create account: ${e.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="content-block">
        <Paper className="auth-page auth-page__signup" variant="outlined">
          {signupResponse.success ? (
            <form onSubmit={handleResend}>
              <div className="content-block">
                <Alert severity="success">Email sent to {emailRef}</Alert>
                {error && <Alert severity="error">{error}</Alert>}
                <FormGroup className="content-block">
                  <FormButton
                    buttonText="Re-send Verification Email"
                    loading={loading}
                  />
                </FormGroup>
              </div>
            </form>
          ) : (
            <>
              <div className="content-block">
                <Typography variant="h4">Sign Up</Typography>
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
                    <TextField
                      type="password"
                      required
                      label="Password Confirmation"
                      variant="standard"
                      value={passwordConfirmRef}
                      onChange={(e) => setPasswordConfirmRef(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="content-block">
                    <FormButton buttonText="Sign Up" loading={loading} />
                  </FormGroup>
                </FormControl>
              </form>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="secondary"
                      checked={agree}
                      onChange={(e) => {
                        setAgree(e.target.checked);
                      }}
                    />
                  }
                  label={`By checking this box you agree to the terms and conditions and agree that you have read and understood our privacy policy`}
                />
              </FormGroup>
            </>
          )}
        </Paper>
      </div>
      <div className="content-block">
        <Typography variant="subtitle1">
          Already have an account? <Link to="/login">Log In</Link>
        </Typography>
      </div>
    </div>
  );
};

export default Signup;
