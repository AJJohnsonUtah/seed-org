import { Card, CardActionArea, CardMedia, Grid, Typography } from "@mui/material";
import React from "react";
import { getNumPlantsInArea, getRowWidthForTargetPlantCount } from "../PlantLayout/LayoutCalculator";
import SeedDialog from "./SeedDialog";

export default function SeedSummary({ seed, onSaveChanges, onDelete }) {
  const [editingSeed, setEditingSeed] = React.useState(false);

  function saveEdit(editedSeed) {
    setEditingSeed(false);
    onSaveChanges(editedSeed);
  }

  return (
    <Card>
      <SeedDialog
        open={editingSeed}
        seed={{ ...seed }}
        onSaveChanges={saveEdit}
        onCancel={() => setEditingSeed(false)}
        onDelete={() => {
          setEditingSeed(false);
          onDelete();
        }}
      />
      <CardActionArea onClick={() => setEditingSeed(true)}>
        {seed.picUrl && <CardMedia component="img" height="180" image={seed.picUrl} alt={seed.name} />}
        <Grid container sx={{ mt: seed.picUrl ? -9 : 0 }}>
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ background: "rgba(255, 255, 255, 0.75)", paddingLeft: 6, paddingRight: 6 }}
            xs={12}
          >
            <Grid item xs={9}>
              <Typography
                variant="h6"
                style={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  maxWidth: "100%",
                }}
              >
                {seed.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" textAlign="right">
                ×{seed.seedsPerPacket * seed.numPackets}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ background: "rgba(255, 255, 255, 0.75)", paddingLeft: 6, paddingRight: 6 }}>
            {seed.minDtm === seed.maxDtm ? seed.minDtm : `${seed.minDtm}-${seed.maxDtm}`} DTM.{" "}
            {getRowWidthForTargetPlantCount(36, seed.spacingInches, seed.seedsPerPacket * seed.numPackets) / 12} row ft.{" "}
            {getNumPlantsInArea(
              getRowWidthForTargetPlantCount(36, seed.spacingInches, seed.seedsPerPacket * seed.numPackets),
              36,
              seed.spacingInches
            )}
          </Grid>
          <Grid
            item
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ background: "rgba(255, 255, 255, 0.75)", paddingLeft: 6, paddingRight: 6 }}
          >
            <Grid item>
              {!seed.startIndoorsMinWeeks && !seed.startIndoorsMaxWeeks
                ? "Direct sow"
                : "Sow indoors " +
                  (seed.startIndoorsMinWeeks === seed.startIndoorsMaxWeeks
                    ? seed.startIndoorsMinWeeks
                    : `${seed.startIndoorsMinWeeks}-${seed.startIndoorsMaxWeeks}`) +
                  " weeks before last frost"}
            </Grid>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
