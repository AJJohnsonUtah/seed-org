const mongoose = require("mongoose");
const { CommentSchema } = require("./commentSchema");

const Schema = mongoose.Schema;

const PlantingSchema = new Schema(
  {
    seedDetails: { type: Schema.Types.ObjectId, ref: "SeedDetails", required: true },
    seedDate: String, // "yyyy-mm-dd"
    transplantDate: String, // "yyyy-mm-dd"
    removeDate: String, // "yyyy-mm-dd"
    readyForHarvestDate: String, // "yyyy-mm-dd"
    actualSpacingInches: Number,
    numSeeded: Number,
    numPlantedOut: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [CommentSchema],
    notes: String,
  },
  { timestamps: true }
);
const PlantingModel = mongoose.model("Planting", PlantingSchema);

module.exports = { PlantingSchema, PlantingModel };
