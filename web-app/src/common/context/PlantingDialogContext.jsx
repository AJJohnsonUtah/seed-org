import React from "react";
import { getRowWidthForTargetPlantCount } from "../../PlantLayout/LayoutCalculator";
import PlantingDialog from "../../PlantLayout/PlantingDialog";
import { PlantingService } from "../services/PlantingService";

export const PlantingDialogContext = React.createContext();

const defaultPlanting = {
  seedDetails: null,
  seedDate: null,
  transplantDate: null,
  removeDate: null,
  readyForHarvestDate: null,
  actualSpacingInches: null,
  numSeeded: null,
  numPlantedOut: null,
  notes: "",
};

export default function PlantingDialogContextProvider({ children }) {
  const [currentPlanting, setCurrentPlanting] = React.useState(null);
  const [plantings, setPlantings] = React.useState([]);

  React.useEffect(() => {
    PlantingService.getPlantings().then((p) => {
      p.forEach(
        (planting) =>
          (planting.inchesNeeded = getRowWidthForTargetPlantCount(36, planting.actualSpacingInches, planting.numSeeded))
      );
      setPlantings(p);
    });
  }, []);

  function addNewPlanting(initialValues) {
    setCurrentPlanting({ ...defaultPlanting, ...initialValues });
  }

  function savePlantingChanges(plantingToSave) {
    if (currentPlanting._id) {
      // Edit
      const updatedPlantings = [...plantings];
      const indexOfCurPlanting = plantings.indexOf(currentPlanting);
      updatedPlantings[indexOfCurPlanting] = plantingToSave;
      setPlantings(updatedPlantings);
    } else {
      // Add
      setPlantings([...plantings, plantingToSave]);
    }
    setCurrentPlanting(null);
  }

  function editPlanting(planting) {
    setCurrentPlanting(planting);
  }

  return (
    <PlantingDialogContext.Provider value={{ addNewPlanting, editPlanting, plantings }}>
      {children}
      <PlantingDialog
        open={Boolean(currentPlanting)}
        planting={currentPlanting}
        onSaveChanges={savePlantingChanges}
        onCancel={() => setCurrentPlanting(null)}
      />
    </PlantingDialogContext.Provider>
  );
}

export function usePlantingContext() {
  return React.useContext(PlantingDialogContext);
}
