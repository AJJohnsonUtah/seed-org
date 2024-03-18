import { Add } from "@mui/icons-material";
import { Fab, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { OrderService } from "../common/services/OrderService";
import OrderDialog, { getCostNumber } from "./OrderDialog";
import OrderSummary from "./OrderSummary";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addingNewOrder, setAddingNewOrder] = useState(false);

  React.useEffect(() => {
    OrderService.getOrders().then(setOrders);
  }, []);

  function beginNewOrder() {
    setAddingNewOrder(true);
  }

  function closeDialog() {
    setAddingNewOrder(false);
    setSelectedOrder(false);
  }

  function onDelete() {
    const idx = orders.findIndex((o) => selectedOrder._id === o._id);
    orders.splice(idx, 1);
    setOrders([...orders]);
    closeDialog();
  }

  const totalSpend = orders.reduce((sum, o) => sum + getCostNumber(o.totalCost), 0);

  return (
    <Paper style={{ maxWidth: 500 }}>
      {orders.map((order, i) => (
        <OrderSummary order={order} key={order._id} setSelectedOrder={setSelectedOrder} />
      ))}
      <Typography variant="h6" style={{ textAlign: "right" }}>
        ${totalSpend.toFixed(2)}
      </Typography>
      <OrderDialog
        open={Boolean(addingNewOrder || selectedOrder)}
        orderToEdit={selectedOrder}
        onSave={(savedOrder) => {
          if (selectedOrder) {
            const idx = orders.findIndex((o) => selectedOrder._id === o._id);
            orders[idx] = savedOrder;
            setOrders([...orders]);
          } else {
            setOrders([...orders, savedOrder]);
          }
          closeDialog();
        }}
        onDelete={onDelete}
        onCancel={closeDialog}
      />
      <Fab
        type="button"
        color="primary"
        aria-label="Add Order"
        onClick={beginNewOrder}
        style={{ position: "fixed", right: 25, bottom: 25 }}
      >
        <Add />
      </Fab>
    </Paper>
  );
}
