import { SeedVarieties } from "../data/SeedVarieties";

function saveSeeds(seeds) {
  console.log(seeds);
  localStorage.setItem("seed-inventory", JSON.stringify(seeds));
}

function loadSeeds() {
  let seeds = localStorage.getItem("seed-inventory");
  if (!seeds) {
    if (window.confirm("Do you want to use the pre-saved seed set?")) {
      seeds = SeedVarieties;
    } else {
      seeds = [];
    }
    saveSeeds(seeds);
    return seeds;
  } else {
    return JSON.parse(seeds);
  }
}

export const SeedInventoryService = {
  saveSeeds,
  loadSeeds,
};
