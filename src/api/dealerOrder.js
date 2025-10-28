import axiosClient from "../config/axiosClient";

const createDealerOrder = (data) => {
  return axiosClient.post("/api/orders", data);
};

const getCustomer = (id) => {
  return axiosClient.get(`/api/customers/dealer/${id}`);
};

const getCustomerById = (id) => {
  return axiosClient.get(`api/customers/${id}`);
};

const getCustomerOrders = (id) => {
  return axiosClient.get(`/api/orders/dealer/${id}`);
};

const getCustomerOrderById = (id) => {
  return axiosClient.get(`/api/orders/${id}/details`);
};

export {
  createDealerOrder,
  getCustomerOrders,
  getCustomerOrderById,
  getCustomer,
  getCustomerById,
};
