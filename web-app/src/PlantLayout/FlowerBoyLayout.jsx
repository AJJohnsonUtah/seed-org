import { Add } from "@mui/icons-material";
import { Fab, List, Typography } from "@mui/material";
import React from "react";
import { usePlantingContext } from "../common/context/PlantingDialogContext";
import DraggablePlanting from "./DraggablePlanting";
import DroppableBedRow from "./DroppableBedRow";
import { getRowWidthForTargetPlantCount } from "./LayoutCalculator";
import PlantingSummary from "./PlantingSummary";

export default function FlowerBoyLayout() {
  const { plantings, addNewPlanting } = usePlantingContext();
  const [rowsNeeded, setRowsNeeded] = React.useState(0);
  const [draggablePlantings, setDraggablePlantings] = React.useState([]);
  const [bedRows, setBedRows] = React.useState([
    { name: "1", lengthInches: 600, widthInches: 36, plantings: [] },
    { name: "2", lengthInches: 600, widthInches: 36, plantings: [] },
    { name: "3", lengthInches: 600, widthInches: 36, plantings: [] },
    { name: "4", lengthInches: 600, widthInches: 36, plantings: [] },
    { name: "5", lengthInches: 600, widthInches: 36, plantings: [] },
    { name: "6", lengthInches: 600, widthInches: 36, plantings: [] },
    { name: "7", lengthInches: 600, widthInches: 36, plantings: [] },
    { name: "8", lengthInches: 600, widthInches: 36, plantings: [] },
  ]);
  React.useEffect(() => {
    let inchesNeeded = 0;
    for (let i = 0; i < plantings.length; i++) {
      inchesNeeded += getRowWidthForTargetPlantCount(36, plantings[i].actualSpacingInches, plantings[i].numSeeded);
    }
    setRowsNeeded(inchesNeeded / 12 / 50);
    setDraggablePlantings([...plantings]);
  }, [plantings]);

  return (
    <div>
      <Typography variant="h6">{rowsNeeded.toFixed(2)} rows needed</Typography>
      <List dense>
        {plantings.map((planting) => (
          <PlantingSummary planting={planting} key={planting._id} />
        ))}
      </List>

      {draggablePlantings.map((planting, i) => (
        <DraggablePlanting
          planting={planting}
          key={planting._id}
          onRelocate={() => {
            draggablePlantings.splice(i, 1);
            setDraggablePlantings([...draggablePlantings]);
          }}
        />
      ))}
      {bedRows.map((row, i) => (
        <DroppableBedRow bed={row} key={row.name} />
      ))}

      <Fab
        type="button"
        color="primary"
        aria-label="Add Planting"
        onClick={addNewPlanting}
        style={{ position: "fixed", right: 25, bottom: 25 }}
      >
        <Add />
      </Fab>
    </div>
  );
}
