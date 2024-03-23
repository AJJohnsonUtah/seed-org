import axios from "axios";

let cachedSeeds = null;
let cachedSeedsPromise = null;

function flushCache() {
  cachedSeeds = null;
}

async function upsertSeedDetails(seedDetails) {
  flushCache();
  return axios.post(process.env.REACT_APP_API_PATH + "/seedDetails", seedDetails).then((r) => r.data);
}

async function loadSeeds() {
  if (cachedSeeds) {
    return Promise.resolve(cachedSeeds);
  }
  if (cachedSeedsPromise) {
    return cachedSeedsPromise;
  }
  cachedSeedsPromise = axios.get(process.env.REACT_APP_API_PATH + "/seedDetails").then((r) => {
    cachedSeeds = r.data;
    cachedSeedsPromise = null;
    return cachedSeeds;
  });
  return cachedSeedsPromise;
}

async function deleteSeedById(seedToDeleteId) {
  flushCache();
  return axios.delete(process.env.REACT_APP_API_PATH + "/seedDetails/" + seedToDeleteId).then((r) => r.data);
}

export const SeedInventoryService = {
  upsertSeedDetails,
  loadSeeds,
  deleteSeedById,
};
