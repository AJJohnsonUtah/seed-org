import { Icon, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { usePlantingContext } from "../common/context/PlantingDialogContext";
import { FillerIcon, FocalFlowerIcon, SecondaryFlowerIcon } from "./../common/icons/TypeOfPlantIcons";
import { getRowWidthForTargetPlantCount } from "./LayoutCalculator";
export function TypeOfPlantIcon({ typeOfPlant, ...props }) {
  let icon;
  switch (typeOfPlant) {
    case "filler":
      icon = <FillerIcon />;
      break;
    case "secondary":
      icon = <SecondaryFlowerIcon />;
      break;
    case "primary":
    default:
      icon = <FocalFlowerIcon />;
      break;
  }
  return <Icon {...props}>{icon}</Icon>;
}

export default function PlantingSummary({ planting }) {
  const { editPlanting } = usePlantingContext();

  return (
    <ListItemButton
      onClick={() => editPlanting(planting)}
      style={{ display: "inline-flex", border: "1px solid #CCC", borderRadius: 8, margin: 4, backgroundColor: "#FFF" }}
    >
      <ListItemIcon>
        <img
          src={planting.seedDetails.picUrl}
          alt={planting.seedDetails.name}
          style={{ maxWidth: 40, maxHeight: 40, borderRadius: 20 }}
        />
      </ListItemIcon>
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
