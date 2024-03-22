import { Alert, Button, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import { useAuthContext } from "../common/context/AuthContext";
import { AuthenticationService } from "./../common/services/AuthenticationService";
const LoginPage = () => {
  const { setCurrentUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    setSubmitting(true);
    // Handle form submission (e.g., send credentials to backend for authentication)
    AuthenticationService.login(email, password)
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setLoginError(err.response?.data.error);
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Container maxWidth="xs">
      <div style={{ marginTop: "64px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
          Login
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
            {submitting ? "Signing In..." : "Sign In"}
          </Button>
          {loginError && <Alert severity="error">{loginError}</Alert>}
        </form>
      </div>
    </Container>
  );
};

export default LoginPage;
