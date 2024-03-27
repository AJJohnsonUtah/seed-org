import { Cancel, Save } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { MyTextField } from "../../common/components/MyTextField";
import { OrganizationService } from "../../common/services/OrganizationService";

export default function AddOrganizationDialog({ open, onClose }) {
  const [organizationName, setOrganizationName] = React.useState("");

  useEffect(() => {
    if (open) {
      setOrganizationName("");
    }
  }, [open]);

  function submitOrg(e) {
    e.preventDefault();
    return OrganizationService.addOrganization({ name: organizationName }).then((updatedOrg) => onClose(updatedOrg));
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Farm / Garden</DialogTitle>
      <form onSubmit={submitOrg}>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Enter the name of your farm or garden (eg, "My Home Garden", "Sunnyvale Farms")
          </Typography>
          <MyTextField
            label="Farm / Garden Name"
            value={organizationName}
            setValue={setOrganizationName}
            style={{ minWidth: 350 }}
            required
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <Button color="warning" startIcon={<Cancel />} type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" startIcon={<Save />} type="submit">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
