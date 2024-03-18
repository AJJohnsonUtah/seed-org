const mongoose = require("mongoose");
const { FileAttachmentSchema } = require('./fileAttachmentSchema');

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  unitCost: mongoose.Types.Decimal128,
  quantity: Number,
  description: String,
  category: String,
  seedDetails: { type: Schema.Types.ObjectId, ref: "SeedDetails" },
});

const OrderSchema = new Schema(
  {
    vendor: String,
    subtotalCost: mongoose.Types.Decimal128,
    totalCost: mongoose.Types.Decimal128,
    shippingCost: mongoose.Types.Decimal128,
    orderItems: [OrderItemSchema],
    orderAttachments: [FileAttachmentSchema],
    orderDate: String, // "yyyy-mm-dd"
    notes: String,
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = { OrderSchema, OrderModel };
