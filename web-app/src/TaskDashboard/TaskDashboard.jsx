import { Card, CardActionArea, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { usePlantingContext } from "../common/context/PlantingDialogContext";
import { SeedInventoryService } from "../common/services/SeedInventoryService";
import { LAST_FROST_32 } from "../data/FarmConstants";

export function TaskSummary({ task }) {
  const { addNewPlanting } = usePlantingContext();

  return (
    <>
      <Card elevation={3} sx={{ m: 1.5 }}>
        <CardActionArea
          sx={{ p: 1 }}
          onClick={() => {
            const seedDate = moment().format("yyyy-MM-DD");
            let readyForHarvestDate = "";
            let transplantDate = "";
            if (task.seed?.minDtm) {
              const matureDate = moment(seedDate).add("days", task.seed.minDtm);
              readyForHarvestDate = matureDate.format("yyyy-MM-DD");
            }
            if (task.seed?.startIndoorsMaxWeeks) {
              const dateToTransplant = LAST_FROST_32;
              transplantDate = dateToTransplant.format("yyyy-MM-DD");
            }

            addNewPlanting({
              seedDetails: task.seed,
              seedDate: moment().format("yyyy-MM-DD"),
              readyForHarvestDate,
              transplantDate,
            });
          }}
        >
          {task.directSow ? (
            <Typography variant="body1">
              Direct sow <b>{task.seed.name}</b>
            </Typography>
          ) : (
            <Typography variant="body1">
              Sow <b>{task.seed.name}</b> Indoors
            </Typography>
          )}
        </CardActionArea>
      </Card>
    </>
  );
}

export default function TaskDashboard() {
  const { plantings } = usePlantingContext();
  const [seeds, setSeeds] = React.useState([]);
  const [upcomingTasks, setUpcomingTasks] = React.useState([]);
  React.useEffect(() => {
    SeedInventoryService.loadSeeds().then((s) => setSeeds([...s]));
  }, []);
  React.useEffect(calculateBouquetCalendar, [seeds, plantings]);

  function calculateBouquetCalendar() {
    const fiveDaysAgo = moment().add(-5, "days");
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

    let seedsNeedingPlanted = seeds.filter((seed) => {
      const doesPlantingAlreadyExist = plantings.find((p) => p.seedDetails._id === seed._id);
      return !doesPlantingAlreadyExist && !seed.plantDate.isBefore(fiveDaysAgo);
    });
    seedsNeedingPlanted.sort((a, b) => a.plantDate.diff(b.plantDate));
    const tasksToDo = [];
    for (let i = 0; i < seedsNeedingPlanted.length; i++) {
      const seed = seedsNeedingPlanted[i];
      const newTask = {
        seed: seed,
        date: seed.plantDate,
        directSow: Boolean(!seed.startIndoorsMaxWeeks),
      };
      tasksToDo.push(newTask);
    }
    setUpcomingTasks(tasksToDo);
  }

  return (
    <>
      <Typography variant="h3">Tasks</Typography>
      {upcomingTasks.map((task, i) => (
        <React.Fragment key={i}>
          {(i === 0 || task.date.format() !== upcomingTasks[i - 1].date.format()) && (
            <Typography variant="h6">{task.date.fromNow()}</Typography>
          )}
          <TaskSummary task={task} />
        </React.Fragment>
      ))}
    </>
  );
}
