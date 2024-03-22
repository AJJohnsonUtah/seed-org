import axios from "axios";

let cachedSeeds = null;
let cachedSeedsPromise = null;

function flushCache() {
  cachedSeeds = null; 
}

async function upsertSeedDetails(seedDetails) {
  flushCache();
  return axios.post(process.env.REACT_APP_API_PATH + "/seedDetails", seedDetails);
}

async function loadSeeds() {
  if (cachedSeeds) {
    return Promise.resolve(cachedSeeds);
  }
  if (cachedSeedsPromise) {
    return cachedSeedsPromise;
  }
  cachedSeedsPromise = axios.get(process.env.REACT_APP_API_PATH + "/seedDetails").then((seeds) => {
    cachedSeeds = seeds;
    cachedSeedsPromise = null;
    return cachedSeeds;
  });
  return cachedSeedsPromise;
}

async function deleteSeedById(seedToDeleteId) {
  flushCache();
  return axios.delete(process.env.REACT_APP_API_PATH + "/seedDetails/" + seedToDeleteId);
}

export const SeedInventoryService = {
  upsertSeedDetails,
  loadSeeds,
  deleteSeedById,
};
