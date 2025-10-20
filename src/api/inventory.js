import axiosClient from "../config/axiosClient";

const importInventory = (data) => {
  return axiosClient.post("/api/inventory", data);
};

const getInventory = () => {
  return axiosClient.get("/api/inventory");
};

const updateInventory = (id, data) => {
  return axiosClient.put(`/api/inventory/${id}`, data);
};

const deleteInventory = (id) => {
  return axiosClient.delete(`/api/inventory/${id}`);
};

const recallInventory = () => {
  return axiosClient.oost(`/api/inventory/recall`);
};

const allocateInventory = () => {
  return axiosClient.post(`/api/inventory/allocate`);
};

export {
  importInventory,
  getInventory,
  updateInventory,
  deleteInventory,
  recallInventory,
  allocateInventory,
};