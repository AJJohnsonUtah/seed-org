import { Add } from "@mui/icons-material";
import { Fab, List, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { usePlantingContext } from "../common/context/PlantingDialogContext";
import PlantingSummary from "./PlantingSummary";

export default function Plantings() {
  const { plantings, addNewPlanting } = usePlantingContext();
  return (
    <div>
      <List dense>
        {plantings.map((planting, i) => (
          <React.Fragment key={planting._id}>
            {(i === 0 || planting.seedDate !== plantings[i - 1].seedDate) && (
              <Typography variant="h6">Seeded on {moment(planting.seedDate).format("l")}</Typography>
            )}
            <PlantingSummary planting={planting} key={planting._id} />
          </React.Fragment>
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
