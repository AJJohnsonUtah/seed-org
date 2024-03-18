import React from "react";

export const DragDropPlantingContext = React.createContext();

export default function DragDropPlantingContextProvider({ children }) {
  const [currentlyDraggedPlanting, setCurrentlyDraggedPlanting] = React.useState(null);

  return (
    <DragDropPlantingContext.Provider value={{ currentlyDraggedPlanting, setCurrentlyDraggedPlanting }}>
      {children}
    </DragDropPlantingContext.Provider>
  );
}

export function useDragDropPlantingContext() {
  return React.useContext(DragDropPlantingContext);
}
