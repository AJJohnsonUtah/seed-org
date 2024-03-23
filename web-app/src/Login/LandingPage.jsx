import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "secondary.dark", color: "white", minHeight: 400, height: "100%", overflowY: "auto" }}>
      <Container sx={{ pt: 12 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography variant="h1" sx={{ fontSize: 100, fontWeight: "500" }} gutterBottom>
              Flower Boy
            </Typography>

            <Typography variant="h5">
              <em>Personal garden assistant</em>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <main style={{ marginTop: 32 }}>
              <Paper elevation={1} style={{ width: "fit-content", margin: "auto", padding: 12 }}>
                <Outlet />
              </Paper>
            </main>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
