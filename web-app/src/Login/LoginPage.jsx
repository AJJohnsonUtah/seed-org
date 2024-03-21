import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import { AuthenticationService } from "./../common/services/AuthenticationService";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send credentials to backend for authentication)
    AuthenticationService.login(email, password);
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
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "24px" }}>
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default LoginPage;
