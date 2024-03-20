import { Cancel, Delete, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import CommentsSection from "../comments/CommentsSection";
import { MyDateField } from "../common/components/MyDateField";
import { PlantingService } from "../common/services/PlantingService";
import { SeedInventoryService } from "../common/services/SeedInventoryService";
import { LAST_FROST_32 } from "../data/FarmConstants";
import { MyTextField } from "./../common/components/MyTextField";

export default function PlantingDialog({ open, planting, onSaveChanges, onCancel, onDelete }) {
  const [allSeeds, setAllSeeds] = React.useState([]);

  React.useEffect(() => {
    SeedInventoryService.loadSeeds().then((s) => setAllSeeds(s));
  }, []);

  const [seedDetailsInputValue, setSeedDetailsInputValue] = useState(planting?.seedDetails?.name || "");
  const [seedDetails, setSeedDetails] = useState(planting?.seedDetails || null);
  const [seedDate, setSeedDate] = useState(planting?.seedDate);
  const [transplantDate, setTransplantDate] = useState(planting?.transplantDate);
  const [removeDate, setRemoveDate] = useState(planting?.removeDate);
  const [readyForHarvestDate, setReadyForHarvestDate] = useState(planting?.readyForHarvestDate);
  const [actualSpacingInches, setActualSpacingInches] = useState(planting?.actualSpacingInches);
  const [numSeeded, setNumSeeded] = useState(planting?.numSeeded);
  const [numPlantedOut, setNumPlantedOut] = useState(planting?.numPlantedOut);
  const [notes, setNotes] = useState(planting?.notes);

  React.useEffect(() => {
    setSeedDetailsInputValue(planting?.seedDetails?.name || "");
    setSeedDetails(planting?.seedDetails || null);
    setSeedDate(planting?.seedDate || null);
    setTransplantDate(planting?.transplantDate || null);
    setRemoveDate(planting?.removeDate || null);
    setReadyForHarvestDate(planting?.readyForHarvestDate || null);
    setActualSpacingInches(planting?.actualSpacingInches || null);
    setNumSeeded(planting?.numSeeded || null);
    setNumPlantedOut(planting?.numPlantedOut || null);
    setNotes(planting?.notes || "");
  }, [planting]);

  function deletePlanting() {
    if (window.confirm("Are you sure you want to delete this planting? [_id: " + planting._id + "]?")) {
      PlantingService.deletePlantingById(planting._id)
        .then(onDelete)
        .catch((e) => {
          console.error(e);
          alert("Error deleting planting!");
        });
    }
  }

  function savePlanting() {
    const plantingToSave = {
      _id: planting._id,
      seedDetails,
      seedDate,
      transplantDate,
      removeDate,
      readyForHarvestDate,
      actualSpacingInches: actualSpacingInches ? +actualSpacingInches : null,
      numSeeded: numSeeded ? +numSeeded : null,
      numPlantedOut: numPlantedOut ? +numPlantedOut : null,
      notes,
    };
    PlantingService.savePlanting(plantingToSave)
      .then(onSaveChanges)
      .catch((e) => {
        console.error(e);
        alert("Error saving planting!");
      });
  }

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="lg">
      <DialogTitle>Planting Info</DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            savePlanting();
          }}
        >
          <Grid container spacing={2}>
            <Grid container spacing={2} item xs={12} md={9}>
              <Grid item xs={12}>
                <Autocomplete
                  autoFocus={true}
                  id="seed-details-for-planting"
                  options={allSeeds.sort((a, b) => {
                    const plantTypeCompare = -b.typeOfPlant.localeCompare(a.typeOfPlant);
                    if (plantTypeCompare === 0) {
                      return -b.name.localeCompare(a.name);
                    }
                    return -plantTypeCompare;
                  })}
                  inputValue={seedDetailsInputValue}
                  onInputChange={(e, val) => setSeedDetailsInputValue(val)}
                  groupBy={(option) => option.typeOfPlant}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value?._id}
                  renderInput={(params) => <TextField {...params} label="Seed Details" />}
                  value={seedDetails}
                  onChange={(e, val) => setSeedDetails(val)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyDateField
                  label="Seeded Date"
                  value={seedDate}
                  setValue={(val) => {
                    setSeedDate(val);
                    if (!readyForHarvestDate && val && seedDetails?.minDtm) {
                      const matureDate = moment(val).add("days", seedDetails.minDtm);
                      setReadyForHarvestDate(matureDate.format("yyyy-MM-DD"));
                    }
                    if (!transplantDate && val && seedDetails?.startIndoorsMaxWeeks) {
                      const dateToTransplant = LAST_FROST_32;
                      setTransplantDate(dateToTransplant.format("yyyy-MM-DD"));
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyDateField label="Transplant Date" value={transplantDate} setValue={setTransplantDate} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyDateField label="Remove Date" value={removeDate} setValue={setRemoveDate} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyDateField
                  label="Ready for Harvest Date"
                  value={readyForHarvestDate}
                  setValue={setReadyForHarvestDate}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField
                  label="Actual Spacing (Inches)"
                  value={actualSpacingInches}
                  setValue={setActualSpacingInches}
                  type="number"
                  fullWidth
                  helperText={seedDetails?.spacingInches ? `Suggested ${seedDetails?.spacingInches}in` : null}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField label="Number Seeded" value={numSeeded} setValue={setNumSeeded} type="number" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField
                  label="Number Planted Out"
                  value={numPlantedOut}
                  setValue={setNumPlantedOut}
                  type="number"
                />
              </Grid>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={12}>
                  <MyTextField label="Notes" value={notes} setValue={setNotes} fullWidth multiline rows={3} />
                </Grid>
              </Grid>
            </Grid>
            <Grid container item spacing={2} xs={4} md={3}>
              <Grid item xs={12}>
                <Card style={{ position: "relative", width: "100%" }}>
                  {seedDetails?.picUrl && (
                    <CardMedia
                      component="img"
                      style={{ width: "100%" }}
                      image={seedDetails.picUrl}
                      alt={seedDetails.name}
                    />
                  )}
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <input type="submit" style={{ display: "none" }} />
        </form>
        {planting?._id && <CommentsSection baseId={planting._id} commentService={PlantingService} />}
      </DialogContent>
      <DialogActions style={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="button" onClick={onCancel} startIcon={<Cancel />} color="warning">
          Cancel
        </Button>
        {planting?._id && (
          <Button type="button" onClick={deletePlanting} startIcon={<Delete />} color="error">
            Delete
          </Button>
        )}
        <Button type="button" startIcon={<Save />} onClick={savePlanting}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
