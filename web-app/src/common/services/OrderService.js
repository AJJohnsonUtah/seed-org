import axios from "axios";

export const OrderService = {
  getOrders: () => axios.get(process.env.REACT_APP_API_PATH + "/orders"),
  saveOrder: (order) => axios.post(process.env.REACT_APP_API_PATH + "/orders", order),
  deleteOrderById: (orderId) => axios.delete(process.env.REACT_APP_API_PATH + "/orders/" + orderId),
};
