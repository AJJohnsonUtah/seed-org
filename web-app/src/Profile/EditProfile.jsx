import { AddAPhoto, Edit } from "@mui/icons-material";
import { Avatar, CircularProgress, Grid, IconButton, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../common/context/AuthContext";
import { UserService } from "../common/services/UserService";

export default function EditProfile() {
  const { currentUser, loginAsUser } = useAuthContext();
  const [fullUserInfo, setFullUserInfo] = useState();
  const [inputImageValue] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  useEffect(() => {
    UserService.getCurrentAuthUser().then(setFullUserInfo);
  }, []);

  return (
    <Grid container spacing={3}>
      {fullUserInfo ? (
        <Grid item xs={12} container spacing={3}>
          <Grid item style={{ position: "relative" }}>
            <Avatar
              style={{ minWidth: 150, minHeight: 150 }}
              alt={fullUserInfo.displayName + " Profile Picture"}
              src={UserService.getSrcUrlForProfilePic(fullUserInfo)}
            />
            <IconButton
              size="large"
              sx={{
                bgcolor: "primary.dark",
                color: "white",
                position: "absolute",
                right: 0,
                bottom: 0,
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.main,
                },
              }}
              onClick={() => document.getElementById("add-image-btn" + fullUserInfo?._id).click()}
              disabled={uploading}
            >
              {uploading ? (
                <CircularProgress style={{ height: 24, width: 24 }} />
              ) : fullUserInfo.profilePic ? (
                <Edit />
              ) : (
                <AddAPhoto />
              )}
            </IconButton>
            <input
              id={"add-image-btn" + fullUserInfo?._id}
              type="file"
              accept="image"
              value={inputImageValue}
              hidden
              onChange={(e) => {
                if (e.target.files[0]) {
                  setUploading(true);
                  UserService.uploadProfilePic(e.target.files[0])
                    .then((updatedUser) => {
                      loginAsUser({ ...currentUser, profilePic: updatedUser.profilePic });
                      setFullUserInfo({ ...fullUserInfo, profilePic: updatedUser.profilePic });
                    })
                    .finally(() => setUploading(false));
                }
              }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h2">{fullUserInfo.displayName}</Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12} container spacing={3}>
          <Grid item>
            <Skeleton variant="circular" style={{ minWidth: 150, minHeight: 150 }} />
          </Grid>
          <Grid item>
            <Skeleton variant="text" />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
