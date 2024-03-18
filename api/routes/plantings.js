var express = require("express");
const { PlantingModel } = require("../db/plantingSchema");
const addCommentEndpointsForModel = require("./genericCommentsEndpoints");
var router = express.Router();

async function loadAllPlantings() {

  return await PlantingModel.find({}).select("-comments").populate("seedDetails").sort("seedDate");
}

/* GET planting */
router.get("/", function (req, res, next) {
  loadAllPlantings().then((plantings) => res.send(plantings));
});

/* POST planting */
router.post("/", async function (req, res, next) {
  const plantingData = req.body;

  if (!plantingData._id) {
    const plantingToCreate = new PlantingModel(plantingData);
    await plantingToCreate.save();
    plantingData._id = plantingToCreate._id;
    res.send(plantingData);
  } else {
    PlantingModel.findByIdAndUpdate(plantingData._id, plantingData, { returnDocument: "after" }).then(() =>
      res.send(plantingData)
    );
  }
});

/* DELETE planting */
router.delete("/:_id", function (req, res, next) {
  PlantingModel.findByIdAndDelete(req.params._id).then(() => res.sendStatus(204));
});

addCommentEndpointsForModel(router, PlantingModel);

module.exports = router;
