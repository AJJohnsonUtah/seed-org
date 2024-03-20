import { Add } from "@mui/icons-material";
import { Fab, List, Typography } from "@mui/material";
import React from "react";
import { usePlantingContext } from "../common/context/PlantingDialogContext";
import PlantingSummary from "./PlantingSummary";

export default function Plantings() {
  const { plantings, addNewPlanting } = usePlantingContext();

  return (
    <div>
      <List dense>
        {plantings.map((planting, i) => (
          <>
            {(i === 0 || planting.seedDate !== plantings[i - 1].seedDate) && (
              <Typography variant="h6">{planting.seedDate}</Typography>
            )}
            <PlantingSummary planting={planting} key={planting._id} />
          </>
        ))}
      </List>

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
