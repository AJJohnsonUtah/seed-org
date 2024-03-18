import { Tooltip } from "@mui/material";
import moment from "moment";
import React from "react";

export function getBgColorString(colors) {
  if (!colors || colors.length === 0) {
    return "pink";
  }

  let i = 0;
  let colorString = `repeating-linear-gradient(45deg`;
  while (i < colors.length) {
    colorString += `, ${colors[i]} ${i * 10}px, ${colors[i]} ${(i + 1) * 10}px`;
    i++;
  }
  colorString += ")";
  return colorString;
}

export default function PlantCalendarRow({ seed, pxPerDay = 4 }) {
  let { plantDate, plantMatureStartDate, plantMatureEndDate, transplantDate } = seed;

  const firstDayOfYear = moment("2024-01-01");
  const lastDayOfYear = moment("2024-12-31");
  const workingPlantDate = moment.max(firstDayOfYear, plantDate);
  const workingPlantMatureStartDate = moment.min(lastDayOfYear, plantMatureStartDate);
  const workingPlantMatureEndDate = moment.min(lastDayOfYear, plantMatureEndDate);

  const totalDays = workingPlantMatureEndDate.diff(plantDate, "days");
  return (
    <Tooltip
      title={
        <div>
          {transplantDate && <p>Sow Indoors: {workingPlantDate.format("L")}</p>}
          {transplantDate && <p>Transplant: {transplantDate.format("L")}</p>}
          {!transplantDate && <p>Direct Sow:{workingPlantDate.format("L")}</p>}
          <p>Plant Matures: {plantMatureStartDate.format("L")}</p>
        </div>
      }
      placement="bottom-start"
    >
      <div style={{ width: pxPerDay * totalDays + 1, borderRadius: 4, height: 12, display: "inline-block" }}>
        {transplantDate && (
          <div
            style={{
              minWidth: (transplantDate.diff(workingPlantDate, "days") * 100) / totalDays + "%",
              maxWidth: (transplantDate.diff(workingPlantDate, "days") * 100) / totalDays + "%",
              overflow: "hidden",
              height: "100%",
              textAlign: "center",
              background: "#68A",
              display: "inline-block",
            }}
          >
            {/* Sow Indoors */}
          </div>
        )}
        <div
          style={{
            minWidth:
              (workingPlantMatureStartDate.diff(transplantDate || workingPlantDate, "days") * 100) / totalDays + "%",
            maxWidth:
              (workingPlantMatureStartDate.diff(transplantDate || workingPlantDate, "days") * 100) / totalDays + "%",
            overflow: "hidden",
            height: "100%",
            background: "brown",
            display: "inline-block",
          }}
        >
          {/* Growing Outdoors */}
        </div>
        <div
          style={{
            minWidth: (workingPlantMatureEndDate.diff(workingPlantMatureStartDate, "days") * 100) / totalDays + "%",
            maxWidth: (workingPlantMatureEndDate.diff(workingPlantMatureStartDate, "days") * 100) / totalDays + "%",
            overflow: "hidden",
            height: "100%",
            background: getBgColorString(seed.plantColors),
            display: "inline-block",
          }}
        >
          {/* Bloom & Harvest */}
        </div>
      </div>
    </Tooltip>
  );
}
