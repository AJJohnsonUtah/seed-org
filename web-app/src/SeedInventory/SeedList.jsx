import { Add } from "@mui/icons-material";
import { Container, Fab, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { SeedInventoryService } from "../common/services/SeedInventoryService";
import SeedDialog from "./SeedDialog";
import SeedSummary from "./SeedSummary";

const defaultSeed = {
  name: "",
  seedsPerPacket: "",
  numPackets: "",
  minDtm: "",
  maxDtm: "",
  startIndoorsMinWeeks: "",
  startIndoorsMaxWeeks: "",
  colors: [],
};

export default function SeedList() {
  const [seedToAdd, setSeedToAdd] = React.useState(null);
  const [seeds, setSeeds] = useState([]);
  const [showNewSeed, setShowNewSeed] = useState(false);

  React.useEffect(() => {
    SeedInventoryService.loadSeeds().then(setSeeds);
  }, []);

  function beginAddingSeed() {
    setSeedToAdd({ ...defaultSeed });
    setShowNewSeed(true);
  }

  function updateSeeds(newSeeds) {
    // Alphabetize Seeds
    newSeeds.sort((a, b) => (a.name > b.name ? 1 : -1));
    setSeeds(newSeeds);
  }

  function addSeed(seed) {
    seeds.push(seed);
    updateSeeds([...seeds]);
    setShowNewSeed(false);
    setSeedToAdd({ ...defaultSeed });
    setTimeout(() => setShowNewSeed(true), 100);
  }

  return (
    <Container>
      <Typography variant="h4">Seed Inventory</Typography>
      <Grid container spacing={1}>
        {seeds.map((seed, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={seed._id}>
            <SeedSummary
              seed={seed}
              onSaveChanges={(updatedSeed) => {
                seeds[i] = updatedSeed;
                updateSeeds([...seeds]);
              }}
              onDelete={() => {
                seeds.splice(i, 1);
                updateSeeds([...seeds]);
              }}
            />
          </Grid>
        ))}
      </Grid>
      {<SeedDialog open={showNewSeed} seed={seedToAdd} onSaveChanges={addSeed} onCancel={() => setShowNewSeed(false)} />}
      {!showNewSeed && (
        <Fab
          type="button"
          color="primary"
          aria-label="Add Seed"
          onClick={beginAddingSeed}
          style={{ position: "fixed", right: 25, bottom: 25 }}
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
}
