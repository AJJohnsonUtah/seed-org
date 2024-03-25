import { Avatar, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function EditProfile() {
  const [fullUserInfo, setFullUserInfo] = useState();

  useEffect(() => {}, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} container spacing={3}>
        <Grid item>
          <Avatar style={{ minWidth: 150 }} />{" "}
        </Grid>
        <Grid item></Grid>
      </Grid>
    </Grid>
  );
}
