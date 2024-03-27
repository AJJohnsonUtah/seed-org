import { AppBar, Button, Container, Divider, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useAuthContext } from "../../common/context/AuthContext";
import { UserService } from "../../common/services/UserService";
import AddOrganizationDialog from "./AddOrganizationDialog";

export default function SetupOrganization() {
  const { loginAsUser, currentUser } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <AppBar />
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h3">Where are you growing?</Typography>
        <Grid container>
          <Grid item xs={12} md={4}>
            <Button onClick={() => setShowDialog(true)}>Set Up a new Farm / Garden</Button>
          </Grid>
          <Grid item xs={12} md={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body1">
              If you are growing with someone else who has already set up a farm, please ask them to add you to their
              organization (using your email <b>{currentUser.email}</b>).
              <Button
                onClick={() => {
                  UserService.getCurrentAuthUser().then(loginAsUser);
                }}
              >
                Click to check if you have access to their space yet
              </Button>
            </Typography>
          </Grid>
        </Grid>
        <AddOrganizationDialog
          open={showDialog}
          onClose={(createdOrg) => {
            if (createdOrg?.name) {
              UserService.getCurrentAuthUser().then(loginAsUser);
            }
            setShowDialog(false);
          }}
        />
      </Container>
    </>
  );
}
