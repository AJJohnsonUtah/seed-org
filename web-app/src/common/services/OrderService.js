import axios from "axios";

export const OrderService = {
  getOrders: () => axios.get(process.env.REACT_APP_API_PATH + "/orders").then((r) => r.data),
  saveOrder: (order) => axios.post(process.env.REACT_APP_API_PATH + "/orders", order).then((r) => r.data),
  deleteOrderById: (orderId) => axios.delete(process.env.REACT_APP_API_PATH + "/orders/" + orderId).then((r) => r.data),
};
