import { Cancel, Delete, Save } from "@mui/icons-material";
import {
  Button,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { MyTextField } from "../common/components/MyTextField";
import { SeedInventoryService } from "../common/services/SeedInventoryService";

export function ColorChip({ color, onDelete }) {
  return <Chip style={{ backgroundColor: color }} onDelete={onDelete} />;
}

export const PLANT_SUPPORT_OPTIONS = [
  { value: "VerticalTrellising", name: "Vertical Trellising" },
  { value: "HorizontalNetting", name: "Horizontal Netting" },
  { value: "Corralling", name: "Corralling" },
  { value: "Staking", name: "Staking" },
];

export default function SeedDialog({ open, seed, onSaveChanges, onCancel, onDelete }) {
  const [name, setName] = useState(seed?.name);
  const [seedsPerPacket, setSeedsPerPacket] = useState(seed?.seedsPerPacket);
  const [numPackets, setNumPackets] = useState(seed?.numPackets);
  const [minDtm, setMinDtm] = useState(seed?.minDtm);
  const [maxDtm, setMaxDtm] = useState(seed?.maxDtm);
  const [seedDepth, setSeedDepth] = useState(seed?.seedDepth);
  const [spacingInches, setSpacingInches] = useState(seed?.spacingInches);
  const [startIndoorsMinWeeks, setStartIndoorsMinWeeks] = useState(seed?.startIndoorsMinWeeks);
  const [startIndoorsMaxWeeks, setStartIndoorsMaxWeeks] = useState(seed?.startIndoorsMaxWeeks);
  const [germinationNotes, setGerminationNotes] = useState(seed?.germinationNotes);
  const [cultivationNotes, setCultivationNotes] = useState(seed?.cultivationNotes);
  const [picUrl, setPicUrl] = useState(seed?.picUrl);
  const [storeUrl, setStoreUrl] = useState(seed?.storeUrl);
  const [typeOfPlant, setTypeOfPlant] = useState(seed?.typeOfPlant);
  const [plantColors, setPlantColors] = useState(seed?.plantColors || []);
  const [supportNeeded, setSupportNeeded] = useState(seed?.supportNeeded || []);

  function deleteSeedDetails() {
    if (window.confirm("Are you sure you want to delete " + name + " [_id: " + seed._id + "]?")) {
      SeedInventoryService.deleteSeedById(seed._id)
        .then(onDelete)
        .catch((e) => {
          console.error(e);
          alert("Error deleting seed!");
        });
    }
  }

  function saveSeedDetails() {
    const upsertedSeedDetails = {
      _id: seed._id,
      name,
      seedsPerPacket: seedsPerPacket ? +seedsPerPacket : null,
      numPackets: numPackets ? +numPackets : null,
      minDtm: minDtm ? +minDtm : null,
      maxDtm: maxDtm ? +maxDtm : null,
      spacingInches: spacingInches ? +spacingInches : null,
      seedDepth: seedDepth ? +seedDepth : null,
      startIndoorsMinWeeks: startIndoorsMinWeeks ? +startIndoorsMinWeeks : null,
      startIndoorsMaxWeeks: startIndoorsMaxWeeks ? +startIndoorsMaxWeeks : null,
      germinationNotes,
      cultivationNotes,
      picUrl,
      storeUrl,
      typeOfPlant,
      plantColors,
      supportNeeded,
    };
    SeedInventoryService.upsertSeedDetails(upsertedSeedDetails)
      .then(onSaveChanges)
      .catch((e) => {
        console.error(e);
        alert("Error saving details!");
      });
  }

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="lg">
      <DialogTitle>Seed Details</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveSeedDetails();
        }}
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid container spacing={2} item xs={12} md={9}>
              <Grid item xs={12} md={8}>
                <MyTextField label="Name" value={name} setValue={setName} autoFocus required fullWidth />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="plant-type-label">Plant Type</InputLabel>
                  <Select
                    labelId="plant-type-label"
                    id="plant-type"
                    value={typeOfPlant}
                    label="Plant Type"
                    onChange={(e) => setTypeOfPlant(e.target.value)}
                  >
                    <MenuItem value="primary">Primary Flower</MenuItem>
                    <MenuItem value="secondary">Secondary Flower</MenuItem>
                    <MenuItem value="filler">Bouquet Filler</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField
                  label="Seeds Per Packet"
                  value={seedsPerPacket}
                  setValue={setSeedsPerPacket}
                  type="number"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField label="Number of Packets" value={numPackets} setValue={setNumPackets} type="number" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField label="DTM (min)" value={minDtm} setValue={setMinDtm} type="number" fullWidth />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField label="DTM (max)" value={maxDtm} setValue={setMaxDtm} type="number" fullWidth />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField
                  label="Seed Depth (Inches)"
                  value={seedDepth}
                  setValue={setSeedDepth}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField
                  label="Spacing (Inches)"
                  value={spacingInches}
                  setValue={setSpacingInches}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField
                  label="Start Indoors Weeks (min)"
                  value={startIndoorsMinWeeks}
                  setValue={setStartIndoorsMinWeeks}
                  type="number"
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <MyTextField
                  label="Start Indoors Weeks (max)"
                  value={startIndoorsMaxWeeks}
                  setValue={setStartIndoorsMaxWeeks}
                  type="number"
                />
              </Grid>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={12}>
                  <MyTextField
                    label="Germination Notes"
                    value={germinationNotes}
                    setValue={setGerminationNotes}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MyTextField
                    label="Cultivation Notes"
                    value={cultivationNotes}
                    setValue={setCultivationNotes}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="support-needed-label">Support Needed</InputLabel>
                    <Select
                      labelId="support-needed-label"
                      id="support-needed"
                      value={supportNeeded}
                      label="Support Neeted"
                      onChange={(e) => {
                        const val = e.target.value;
                        setSupportNeeded(typeof val === "string" ? val.split(",") : val);
                      }}
                      multiple
                    >
                      {PLANT_SUPPORT_OPTIONS.map((supportOpt) => (
                        <MenuItem value={supportOpt.value} key={supportOpt.value}>
                          {supportOpt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <MyTextField label="Pic URL" value={picUrl} setValue={setPicUrl} fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <MyTextField label="Link to Item" value={storeUrl} setValue={setStoreUrl} fullWidth />
                  {storeUrl && (
                    <Link href={storeUrl} underline="hover" target="_blank">
                      Click to view original site
                    </Link>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid container item spacing={2} xs={12} md={3}>
              <Grid item xs={12}>
                <Card style={{ position: "relative", width: "100%" }}>
                  {picUrl && <CardMedia component="img" style={{ width: "100%" }} image={picUrl} alt={name} />}
                  <input
                    type="color"
                    name="currentColor"
                    onChange={(e) => setPlantColors([...plantColors, e.target.value])}
                  />
                  <Typography variant="body2">Color Picker</Typography>
                  {plantColors.map((color, i) => (
                    <ColorChip
                      key={i}
                      color={color}
                      onDelete={() => {
                        plantColors.splice(i, 1);
                        setPlantColors([...plantColors]);
                      }}
                    />
                  ))}
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="button" onClick={onCancel} startIcon={<Cancel />} color="warning">
            Cancel
          </Button>
          {seed?._id && (
            <Button type="button" onClick={deleteSeedDetails} startIcon={<Delete />} color="error">
              Delete
            </Button>
          )}
          <Button type="submit" startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
