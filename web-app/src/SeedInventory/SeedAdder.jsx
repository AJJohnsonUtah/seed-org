import { Cancel, Save } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

export function MyTextField({ value, setValue, label, ...props }) {
  return (
    <TextField label={label} value={value} onChange={(e) => setValue(e.target.value)} {...props} variant="standard" />
  );
}

export default function SeedAdder({ open, seed, onSaveChanges, onCancel }) {
  const [name, setName] = useState(seed?.name);
  const [seedsPerPacket, setSeedsPerPacket] = useState(seed?.seedsPerPacket);
  const [numPackets, setNumPackets] = useState(seed?.numPackets);
  const [minDtm, setMinDtm] = useState(seed?.minDtm);
  const [maxDtm, setMaxDtm] = useState(seed?.maxDtm);
  const [startIndoorsMinWeeks, setStartIndoorsMinWeeks] = useState(seed?.startIndoorsMinWeeks);
  const [startIndoorsMaxWeeks, setStartIndoorsMaxWeeks] = useState(seed?.startIndoorsMaxWeeks);
  const [picUrl, setPicUrl] = useState(seed?.picUrl);
  const [storeUrl, setStoreUrl] = useState(seed?.storeUrl);
  const [typeOfPlant, setTypeOfPlant] = useState(seed?.typeOfPlant);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle>Seed Details</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveChanges({
            name,
            seedsPerPacket,
            numPackets,
            minDtm,
            maxDtm,
            startIndoorsMinWeeks,
            startIndoorsMaxWeeks,
            picUrl,
            storeUrl,
            typeOfPlant,
          });
        }}
      >
        <DialogContent>
          <Grid container spacing={2}>
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
              <MyTextField label="Seeds Per Packet" value={seedsPerPacket} setValue={setSeedsPerPacket} type="number" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MyTextField label="Number of Packets" value={numPackets} setValue={setNumPackets} type="number" />
            </Grid>
            <Grid item xs={6}>
              <MyTextField label="DTM (min)" value={minDtm} setValue={setMinDtm} type="number" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <MyTextField label="DTM (max)" value={maxDtm} setValue={setMaxDtm} type="number" fullWidth />
            </Grid>
            <Grid item>
              <MyTextField
                label="Start Indoors Weeks (min)"
                value={startIndoorsMinWeeks}
                setValue={setStartIndoorsMinWeeks}
                type="number"
              />
            </Grid>
            <Grid item>
              <MyTextField
                label="Start Indoors Weeks (max)"
                value={startIndoorsMaxWeeks}
                setValue={setStartIndoorsMaxWeeks}
                type="number"
              />
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={12} md={6}>
                <MyTextField label="Pic URL" value={picUrl} setValue={setPicUrl} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <MyTextField label="Link to Item" value={storeUrl} setValue={setStoreUrl} fullWidth />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="button" onClick={onCancel} startIcon={<Cancel />} color="warning">
            Cancel
          </Button>
          <Button type="submit" startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
