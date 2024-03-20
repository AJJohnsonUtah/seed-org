import { Box, Typography } from "@mui/material";
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
      }}
      key={planting._id}
      style={{
        height: 36,
        background: getBgColorString(planting.seedDetails?.plantColors),
        opacity: currentlyDraggedPlanting?._id === planting._id ? 0.3 : 1,
        width: planting.inchesNeeded * 2,
        cursor: "grab",
        textAlign: "center",
        padding: 6,
      }}
    >
      <Typography
        style={{
          maxWidth: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "fit-content",
          margin: "auto",
        }}
      >
        {planting.seedDetails.name}
      </Typography>
    </Box>
  );
}
