import { Alert, Button, CircularProgress, Container, Grid, TextField } from "@mui/material";
import React, { useState } from "react";

import { Link } from "react-router-dom";
import { useAuthContext } from "../common/context/AuthContext";
import { AuthenticationService } from "./../common/services/AuthenticationService";
const LoginPage = () => {
  const { loginAsUser } = useAuthContext();
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
        loginAsUser(user);
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "24px" }}>
          <Grid container spacing={2} justifyContent={"center"}>
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
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{}}
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size="small" style={{ height: 16, width: 16 }} color="inherit" />
                  ) : undefined
                }
              >
                {submitting ? "Signing In..." : "Sign In"}
              </Button>
            </Grid>
          </Grid>
          {loginError && <Alert severity="error">{loginError}</Alert>}
        </form>
        <Button component={Link} to="/public/sign-up" sx={{ mt: 3 }}>
          New here? Sign up now
        </Button>
      </div>
    </Container>
  );
};

export default LoginPage;
