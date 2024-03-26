import { Avatar } from "@mui/material";
import React from "react";
import { UserService } from "../services/UserService";

export default function UserAvatar({ user, ...props }) {
  if (!user) {
    return <Avatar {...props} />;
  }
  if (!user.profilePic) {
    return <Avatar alt={user.displayName} {...props} />;
  }

  return <Avatar alt={user.displayName} src={UserService.getSrcUrlForProfilePic(user)} {...props} />;
}
