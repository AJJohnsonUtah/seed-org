import { Alert, Button, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import { Link } from "react-router-dom";
import { useAuthContext } from "../common/context/AuthContext";
import { AuthenticationService } from "./../common/services/AuthenticationService";
const SignUpPage = () => {
  const { loginAsUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [signupError, setSignUpError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSignUpError("");
    setSubmitting(true);
    // Handle form submission (e.g., send credentials to backend for authentication)
    AuthenticationService.signup(email, password, displayName)
      .then((user) => {
        loginAsUser(user);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setSignUpError(err.response?.data.error);
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Container maxWidth="xs">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h5" gutterBottom>
          New User
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "24px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                id="email"
                fullWidth
                variant="outlined"
                label="Email"
                type="email"
                value={email}
                required
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="password"
                fullWidth
                variant="outlined"
                label="Password"
                type="password"
                value={password}
                required
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="display-name"
                fullWidth
                variant="outlined"
                label="Display Name"
                value={displayName}
                required
                onChange={handleDisplayNameChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "24px" }}
            disabled={submitting}
            startIcon={
              submitting ? (
                <CircularProgress size="small" style={{ height: 16, width: 16 }} color="inherit" />
              ) : undefined
            }
          >
            {submitting ? "Signing Up..." : "Sign Up"}
          </Button>
          {signupError && <Alert severity="error">{signupError}</Alert>}
        </form>
        <Button component={Link} to="/public/login">
          Already signed up? Log in here
        </Button>
      </div>
    </Container>
  );
};

export default SignUpPage;
