import axiosClient from "../config/axiosClient";

const importInventory = (data) => {
  return axiosClient.post("/api/inventory/manufacturer", data);
};

const importDealerInventory = (data) => {
  return axiosClient.post("/api/inventory/dealer", data);
};

const getInventory = () => {
  return axiosClient.get("/api/inventory/manufacturer");
};

const getDealerInventory = () => {
  return axiosClient.get("/api/inventory/dealer");
};

const updateInventory = (id, data) => {
  return axiosClient.put(`/api/inventory/${id}`, data);
};

const deleteInventory = (id) => {
  return axiosClient.delete(`/api/inventory/dealer/${id}`);
};

const recallInventory = (data) => {
  return axiosClient.post(`/api/inventory/recall`, data);
};

const allocateInventory = (data) => {
  return axiosClient.post(`/api/inventory/allocate`, data);
};

export {
  importInventory,
  getInventory,
  updateInventory,
  deleteInventory,
  recallInventory,
  allocateInventory,
  importDealerInventory,
  getDealerInventory,
};
