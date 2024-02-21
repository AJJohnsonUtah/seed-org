// const jetpack = require("fs-jetpack");

function saveSeeds(seeds) {
  console.log(seeds);
  localStorage.setItem("seed-inventory", JSON.stringify(seeds));
  // jetpack.write("seed-inventory.json", seeds);
}

function loadSeeds() {
  const seeds = localStorage.getItem("seed-inventory");
  //   const seeds = jetpack.read("seed-inventory.json", "json");
  if (!seeds) {
    saveSeeds([]);
    return [];
  } else {
    return JSON.parse(seeds);
  }
}

export const SeedInventoryService = {
  saveSeeds,
  loadSeeds,
};
