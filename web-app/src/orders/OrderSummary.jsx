import { ButtonBase, Grid, Paper, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

export default function OrderSummary({ order, setSelectedOrder }) {
  return (
    <Paper
      component={ButtonBase}
      sx={{ p: 0.5, textAlign: "left", width: "100%" }}
      onClick={() => setSelectedOrder(order)}
    >
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant="body1">{moment(order.orderDate).format("MM/DD/yyyy")}</Typography>
        </Grid>
        <Grid item flexGrow={1}>
          <Typography variant="body1">{order.vendor}</Typography>
        </Grid>
        <Grid item style={{ textAlign: "right" }}>
          <Typography variant="body1">-${order.totalCost?.$numberDecimal}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
