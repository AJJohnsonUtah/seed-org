export function getNumRows(rowHeight, spacing) {
  return Math.max(1, Math.floor((rowHeight - spacing) / ((Math.sqrt(3) / 2) * spacing)));
}

export function getNumPlantsInRow(rowWidth, spacing, isEvenRow) {
  const widthToUse = isEvenRow ? rowWidth : rowWidth - spacing / 2;
  return Math.floor((widthToUse - spacing) / spacing);
}

export function getNumPlantsInArea(rowWidth, rowHeight, spacing) {
  const numRows = getNumRows(rowHeight, spacing);
  const evenRowCount = Math.ceil(numRows / 2);
  const oddRowCount = numRows - evenRowCount;

  return (
    evenRowCount * getNumPlantsInRow(rowWidth, spacing, true) +
    oddRowCount * getNumPlantsInRow(rowWidth, spacing, false)
  );
}

export function getRowWidthForTargetPlantCount(rowHeight, spacing, targetPlantCount) {
  const numRows = getNumRows(rowHeight, spacing);
  const possibleWidth = spacing * Math.floor(targetPlantCount / numRows) + spacing;
  if (getNumPlantsInArea(possibleWidth, rowHeight, spacing) < targetPlantCount) {
    if (getNumPlantsInArea(possibleWidth + spacing / 2, rowHeight, spacing) < targetPlantCount) {
      if (getNumPlantsInArea(possibleWidth + spacing, rowHeight, spacing) < targetPlantCount) {
        return possibleWidth + 1.5 * spacing;
      }
      return possibleWidth + spacing;
    }
    return possibleWidth + spacing / 2;
  }
  return possibleWidth;
}

/**
 * UNUSED AT the moment
 * @param {*} plantings 
 * @returns 
 */
export function optimizePlantings(plantings) {
  let inchesNeeded = 0;
  let lengths = [];
  for (let i = 0; i < plantings.length; i++) {
    plantings[i].inchesNeeded = getRowWidthForTargetPlantCount(
      36,
      plantings[i].actualSpacingInches,
      plantings[i].numSeeded
    );
    inchesNeeded += plantings[i].inchesNeeded;
    lengths.push(plantings[i].inchesNeeded);
  }
  plantings.sort((a, b) => b.inchesNeeded - a.inchesNeeded);

  return inchesNeeded;
}
