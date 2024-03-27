import { Cancel, Send } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { MyTextField } from "../../common/components/MyTextField";
import { OrganizationService } from "../../common/services/OrganizationService";

export default function InviteCollaborator({ open, onClose, organization }) {
  const [collaboratorEmail, setCollaboratorEmail] = React.useState("");

  useEffect(() => {
    if (open) {
      setCollaboratorEmail("");
    }
  }, [open]);

  function submitInvite(e) {
    e.preventDefault();
    return OrganizationService.inviteCollaborator(organization._id, collaboratorEmail).then((updatedOrg) =>
      onClose(updatedOrg)
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Collaborator to {organization.name}</DialogTitle>
      <form onSubmit={submitInvite}>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Enter the email address of the person you'd like to add.
          </Typography>
          <MyTextField
            label="Email"
            value={collaboratorEmail}
            setValue={setCollaboratorEmail}
            style={{ minWidth: 350 }}
            type="email"
            required
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <Button color="warning" startIcon={<Cancel />} type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" startIcon={<Send />} type="submit">
            Invite
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
