import { Grid } from "@mui/material";
import React from "react";
import { useDragDropPlantingContext } from "./DragDropPlantingContext";
import DraggablePlanting from "./DraggablePlanting";

function getTotalInchesUsedInBed(bedPlantings) {
  let inchesUsed = 0;
  for (let i = 0; i < bedPlantings.length; i++) {
    inchesUsed += bedPlantings[i].inchesNeeded;
  }
  return inchesUsed;
}

export default function DroppableBedRow({ bed, updateBed }) {
  const dragDropContext = useDragDropPlantingContext();
  const [currentlyOverBed, setCurrentlyOverBed] = React.useState(false);
  const [bedPlantings, setBedPlantings] = React.useState([]);

  function handleDrop(e) {
    e.preventDefault();
    setCurrentlyOverBed(false);
    if (dragDropContext.currentlyDraggedPlanting) {
      dragDropContext.currentlyDraggedPlanting.onRelocateBed();
      // draggablePlantings.splice(draggablePlantings.findIndex(currentlyDraggedPlanting), 1);
      // setDraggablePlantings([...draggablePlantings]);
      setBedPlantings([...bedPlantings, dragDropContext.currentlyDraggedPlanting]);
      dragDropContext.setCurrentlyDraggedPlanting(null);
    }
  }

  const isDragging = Boolean(dragDropContext.currentlyDraggedPlanting);

  const canPlantingFitInBed =
    isDragging &&
    bed.lengthInches - getTotalInchesUsedInBed(bedPlantings) >= dragDropContext.currentlyDraggedPlanting.inchesNeeded;
  const isPlantingAlreadyInBed =
    isDragging && bedPlantings.findIndex((p) => dragDropContext.currentlyDraggedPlanting._id === p._id) >= 0;

  const canBeDroppedInto = isDragging && canPlantingFitInBed;
  return (
    <Grid
      container
      style={{
        backgroundColor: "brown",
        height: 50,
        width: 1200,
        border: `1px solid ${dragDropContext.currentlyDraggedPlanting && currentlyOverBed ? "red" : "black"}`,
        position: "relative",
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setCurrentlyOverBed(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setCurrentlyOverBed(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={canBeDroppedInto ? handleDrop : null}
    >
      {dragDropContext.currentlyDraggedPlanting && !isPlantingAlreadyInBed && !canPlantingFitInBed && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            color: "#822",
            textAlign: "center",
            zIndex: 10000,
            fontSize: 24,
          }}
        >
          Not enough room in bed
        </div>
      )}
      {bedPlantings.map((planting, i) => (
        <DraggablePlanting
          key={planting._id}
          planting={planting}
          onRelocate={() => {
            bedPlantings.splice(i, 1);
            setBedPlantings([...bedPlantings]);
          }}
        />
      ))}
    </Grid>
  );
}
