var express = require("express");
const { SeedDetailsModel } = require("../db/seedDetailsSchema");
var router = express.Router();
const { v4 } = require("uuid");

async function loadAllSeeds() {
  return await SeedDetailsModel.find({}).sort("name");
}

/* GET seed details */
router.get("/", function (req, res, next) {
  loadAllSeeds().then((seeds) => res.send(seeds));
});

/* POST seed details */
router.post("/", async function (req, res, next) {
  const seedData = req.body;

  if (seedData.picUrl && !seedData.plantColors?.length) {
    const getColors = require("get-image-colors");
    try {
      let picPath = seedData.picUrl;
      if (picPath.startsWith("/")) {
        const path = require("path");
        picPath = path.join(__dirname, "../../web-app/public", picPath);
      }
      const colors = await getColors(picPath, { count: 3 });
      seedData.plantColors = colors.map((color) => color.hex());
    } catch (e) {
      console.error(e);
    }
  }

  if (!seedData._id) {
    const seedToCreate = new SeedDetailsModel(seedData);
    seedToCreate.save();
    res.send(seedToCreate);
  } else {
    SeedDetailsModel.findByIdAndUpdate(seedData._id, seedData, { returnDocument: "after" }).then((updatedSeed) =>
      res.send(updatedSeed)
    );
  }
});

/* DELETE seed details */
router.delete("/:_id", function (req, res, next) {
  SeedDetailsModel.findByIdAndDelete(req.params._id).then(() => res.sendStatus(204));
});

module.exports = router;
