import { Divider, Grid, Paper, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { SeedInventoryService } from "../common/services/SeedInventoryService";
import { LAST_FROST_32 } from "../data/FarmConstants";
import PlantCalendarRow from "./PlantCalendarRow";

const containerWidth = 1300;
const pxPerDay = (containerWidth * 0.75) / 366;

export function LegendPiece({ color, label }) {}

export function GrowingCalendarRows({ seeds, label }) {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6">{label}</Typography>
      </Grid>
      {seeds.map((seed, i) => (
        <React.Fragment key={i}>
          <Grid item xs={3}>
            {seed.name}
          </Grid>
          <Grid item xs={9}>
            <span
              style={{
                display: "inline-block",
                height: 4,
                width: pxPerDay * seed.plantDate.diff(moment("2024-01-01"), "days") - 1,
              }}
            />
            <PlantCalendarRow seed={seed} pxPerDay={pxPerDay} />
          </Grid>
          <Divider />
        </React.Fragment>
      ))}
    </>
  );
}

export default function FloralMixCalendarDisplay() {
  const [seeds, setSeeds] = React.useState([]);

  React.useEffect(() => {
    SeedInventoryService.loadSeeds().then((s) => setSeeds([...s]));
  }, []);

  const [seedCalendar, setSeedCalendar] = React.useState([]);
  const months = [
    { name: "January", days: 31, shortName: "Jan" },
    { name: "February", days: 29, shortName: "Feb" },
    { name: "March", days: 31, shortName: "Mar" },
    { name: "April", days: 30, shortName: "Apr" },
    { name: "May", days: 31, shortName: "May" },
    { name: "June", days: 30, shortName: "Jun" },
    { name: "July", days: 31, shortName: "Jul" },
    { name: "August", days: 31, shortName: "Aug" },
    { name: "September", days: 30, shortName: "Sep" },
    { name: "October", days: 31, shortName: "Oct" },
    { name: "November", days: 30, shortName: "Nov" },
    { name: "December", days: 31, shortName: "Dec" },
  ];

  function calculateBouquetCalendar() {
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];

      if (seed.startIndoorsMaxWeeks) {
        // Date to plant is date of last frost minus max weeks
        seed.plantDate = moment(LAST_FROST_32).subtract(seed.startIndoorsMaxWeeks, "weeks");
        seed.transplantDate = moment(LAST_FROST_32);
      } else {
        // Date to plant is date of last frost, if direct sow
        seed.plantDate = moment(LAST_FROST_32);
      }
      seed.plantMatureStartDate = moment(seed.plantDate).add(seed.minDtm, "days");
      const daysToAdd = +seed.minDtm + (seed.bloomDurationDays || 40);
      seed.plantMatureEndDate = moment(seed.plantDate).add(daysToAdd, "days");
    }
    setSeedCalendar([...seeds]);
  }

  React.useEffect(calculateBouquetCalendar, [seeds]);
  return (
    <Paper style={{ padding: 8, maxWidth: "100%", overflowX: "scroll" }}>
      <div style={{ width: containerWidth }} id="calendar-container">
        <Grid container spacing={1} style={{ position: "relative" }}>
          <Grid item xs={3}></Grid>
          <Grid item xs={9}>
            {months.map((month, i) => (
              <div style={{ display: "inline-block" }} key={i}>
                <div
                  style={{
                    display: "inline-block",
                    width: month.days * pxPerDay,
                    textAlign: "center",
                  }}
                >
                  {month.shortName}
                </div>
                <div
                  style={{
                    height: "100%",
                    position: "absolute",
                    display: "inline-block",
                    width: "1px",
                    backgroundColor: "black",
                  }}
                />
              </div>
            ))}
          </Grid>
          <GrowingCalendarRows
            seeds={seedCalendar.filter((seed) => seed.typeOfPlant === "primary")}
            label="Primary Flowers"
          />
          <GrowingCalendarRows
            seeds={seedCalendar.filter((seed) => seed.typeOfPlant === "secondary")}
            label="Secondary Flowers"
          />
          <GrowingCalendarRows
            seeds={seedCalendar.filter((seed) => seed.typeOfPlant === "filler")}
            label="Bouquet Filler"
          />
        </Grid>
      </div>
    </Paper>
  );
}
