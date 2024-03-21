const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SeedDetailsSchema = new Schema(
  {
    name: String,
    seedsPerPacket: Number,
    numPackets: Number,
    minDtm: Number,
    maxDtm: Number,
    seedDepth: Number,
    spacingInches: Number,
    startIndoorsMinWeeks: Number,
    startIndoorsMaxWeeks: Number,
    germinationNotes: String,
    cultivationNotes: String,
    picUrl: String,
    storeUrl: String,
    typeOfPlant: String,
    plantColors: [String],
    supportNeeded: [String],
  },
  { timestamps: true }
);
const SeedDetailsModel = mongoose.model("SeedDetails", SeedDetailsSchema);

module.exports = { SeedDetailsModel, SeedDetailsSchema };
