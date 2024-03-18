import { Box } from "@mui/material";
import React from "react";
import { getBgColorString } from "../FloralMixCalendar/PlantCalendarRow";
import { useDragDropPlantingContext } from "./DragDropPlantingContext";

export default function DraggablePlanting({ planting, onRelocate }) {
  const { currentlyDraggedPlanting, setCurrentlyDraggedPlanting } = useDragDropPlantingContext();

  return (
    <Box
      draggable
      onDragStart={(e) => {
        planting.onRelocateBed = onRelocate;
        setCurrentlyDraggedPlanting(planting);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={(e) => {
        setTimeout(() => setCurrentlyDraggedPlanting(null));
        // draggablePlantings.splice(i, 0, currentlyDraggedItem);
        // setDraggablePlantings([...draggablePlantings]);
      }}
      key={planting._id}
      style={{
        height: 36,
        background: getBgColorString(planting.seedDetails?.plantColors),
        opacity: currentlyDraggedPlanting?._id === planting._id ? 0.3 : 1,
        width: planting.inchesNeeded * 2,
        cursor: "grab",
      }}
    />
  );
}
