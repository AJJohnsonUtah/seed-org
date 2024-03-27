import { AddBox } from "@mui/icons-material";
import {
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserAvatar from "../../common/components/UserAvatar";
import { useAuthContext } from "../../common/context/AuthContext";
import { OrganizationService } from "../../common/services/OrganizationService";
import InviteCollaborator from "./InviteCollaborator";

export default function ManageOrganization() {
  const { currentUser } = useAuthContext();
  const { organizationId } = useParams();

  const [organizationInfo, setOrganizationInfo] = useState();
  const [showInviteCollaborator, setShowInviteCollaborator] = useState(false);

  useEffect(() => {
    OrganizationService.getOrganizationInfo(organizationId).then(setOrganizationInfo);
  }, [organizationId]);

  return (
    <>
      {organizationInfo ? (
        <div>
          <Typography variant="h1">{organizationInfo.name}</Typography>
          <Typography variant="h6">Members</Typography>

          <List>
            {organizationInfo.members.map((m) => (
              <ListItem
                key={m.user._id}
                secondaryAction={
                  m.user._id !== currentUser._id && (
                    <Button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Do you really want to remove " +
                              m.user.displayName +
                              " from " +
                              organizationInfo.name +
                              "?"
                          )
                        ) {
                          OrganizationService.removeMember(organizationInfo._id, m.user._id).then(setOrganizationInfo);
                        }
                      }}
                    >
                      Remove
                    </Button>
                  )
                }
              >
                <ListItemAvatar>
                  <UserAvatar user={m.user} />
                </ListItemAvatar>
                <ListItemText
                  primary={m.user.displayName + (m.user._id === currentUser._id ? " (You)" : "")}
                  secondary={m.user.email + ` ${m.user.accountVerification.verified ? "Verified" : "Unverified"}`}
                />
              </ListItem>
            ))}
            <ListItemButton onClick={() => setShowInviteCollaborator(true)}>
              <ListItemIcon>
                <AddBox color="success" />
              </ListItemIcon>
              <ListItemText primary="Add another collaborator" />
            </ListItemButton>
            <InviteCollaborator
              open={showInviteCollaborator}
              organization={organizationInfo}
              onClose={(updatedOrg) => {
                if (updatedOrg?.name) {
                  setOrganizationInfo({ ...updatedOrg });
                }
                setShowInviteCollaborator(false);
              }}
            />
          </List>
          {organizationInfo.pendingMembers?.length > 0 && (
            <>
              <Typography variant="h6">Pending Member Invites</Typography>
              <List>
                {organizationInfo.pendingMembers.map((pm) => (
                  <ListItem
                    key={pm.email}
                    secondaryAction={
                      <Button
                        onClick={() => {
                          if (window.confirm("Do you really want to revoke the invite to " + pm.email + "?")) {
                            OrganizationService.revokeInvite(organizationInfo._id, pm.email).then(setOrganizationInfo);
                          }
                        }}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <UserAvatar user={pm.user} />
                    </ListItemAvatar>
                    <ListItemText primary={pm.email} secondary={`Invite sent ${moment(pm.invitedDate).format("LL")}`} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
