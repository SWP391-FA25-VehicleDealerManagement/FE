import axiosClient from "../config/axiosClient";

const getAllVehicles = () => {
  return axiosClient.get("/api/vehicles");
};

const getVehicleById = (id) => {
  return axiosClient.get(`/api/vehicles/${id}`);
};

const getVehicleDealers = (id) => {
  return axiosClient.get(`/api/vehicles/dealer/${id}/vehicles`);
};

const createVehicle = (formData) => {
  return axiosClient.post("/api/vehicles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateVehicle = (id, formData) => {
  return axiosClient.put(`/api/vehicles/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteVehicle = (id) => {
  return axiosClient.delete(`/api/vehicles/${id}`);
};

export {
  getAllVehicles,
  getVehicleById,
  getVehicleDealers,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
