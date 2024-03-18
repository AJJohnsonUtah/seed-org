import { ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { usePlantingContext } from "../common/context/PlantingDialogContext";
import { getRowWidthForTargetPlantCount } from "./LayoutCalculator";

export default function PlantingSummary({ planting }) {
  const { editPlanting } = usePlantingContext();

  return (
    <ListItemButton onClick={() => editPlanting(planting)}>
      <ListItemText
        primary={planting.seedDetails?.name}
        secondary={
          (getRowWidthForTargetPlantCount(36, planting.actualSpacingInches, planting.numSeeded) / 12).toFixed(2) +
          "ft for " +
          planting.numSeeded +
          " plants"
        }
      ></ListItemText>
    </ListItemButton>
  );
}
