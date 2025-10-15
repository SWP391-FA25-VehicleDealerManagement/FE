import axiosClient from "../config/axiosClient";

const getAllVehicles = () => {
  return axiosClient.get("/api/vehicles");
};

const getVehicleById = (id) => {
  return axiosClient.get(`/api/vehicles/${id}`);
};

const getVehicleDealers = (id) => {
  return axiosClient.get(`/api/vehicles/dealers/${id}`);
};

const createVehicle = (data) => {
  return axiosClient.post("/api/vehicles/create", data);
};

const updateVehicle = (id, data) => {
  return axiosClient.put(`/api/vehicles/${id}`, data);
};

const deleteVehicle = (id) => {
  return axiosClient.delete(`/api/vehicles/delete/${id}`);
};

export {
  getAllVehicles,
  getVehicleById,
  getVehicleDealers,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
