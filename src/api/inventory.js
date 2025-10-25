import axiosClient from "../config/axiosClient";


const getInventory = () => {
  return axiosClient.get("/api/vehicles/manufacturer/stock");
};

const getDealerInventory = (id) => {
  return axiosClient.get(`/api/vehicles/dealer/${id}/stock`);
};

const recallInventory = (data) => {
  return axiosClient.post(`/api/inventory/recall`, data);
};

const allocateInventory = (data) => {
  return axiosClient.post(`/api/inventory/allocate`, data);
};

export {
  getInventory,
  recallInventory,
  allocateInventory,
  getDealerInventory,
};
