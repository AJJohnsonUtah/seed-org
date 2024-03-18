var express = require("express");
const { OrderModel } = require("../db/orderSchema.js");
var router = express.Router();

async function loadAllOrders() {
  return await OrderModel.find({}).populate("orderItems.seedDetails").sort("orderDate");
}

/* GET order */
router.get("/", function (req, res, next) {
  loadAllOrders().then((orders) => res.send(orders));
});

/* POST order */
router.post("/", async function (req, res, next) {
  const orderData = req.body;

  if (!orderData._id) {
    const orderToCreate = new OrderModel(orderData);
    const savedOrder = await orderToCreate.save().then((o) => o.populate("orderItems.seedDetails"));
    res.send(savedOrder);
  } else {
    const savedOrder = await OrderModel.findByIdAndUpdate(orderData._id, orderData, {
      returnDocument: "after",
    }).populate("orderItems.seedDetails");

    res.send(savedOrder);
  }
});

/* DELETE order */
router.delete("/:_id", function (req, res, next) {
  OrderModel.findByIdAndDelete(req.params._id).then(() => res.sendStatus(204));
});

module.exports = router;
