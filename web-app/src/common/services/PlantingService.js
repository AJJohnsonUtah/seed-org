import axios from "axios";
import { getCommentFunctions } from "./GenericCommentService";
export const PLANTING_BASE_URL = process.env.REACT_APP_API_PATH + "/plantings";

const commentFunctions = getCommentFunctions(PLANTING_BASE_URL);

export const PlantingService = {
  getPlantings: () => axios.get(PLANTING_BASE_URL).then((r) => r.data),
  savePlanting: (planting) => axios.post(PLANTING_BASE_URL, planting).then((r) => r.data),
  deletePlantingById: (plantingId) => axios.delete(PLANTING_BASE_URL + "/" + plantingId).then((r) => r.data),
  ...commentFunctions,
};
