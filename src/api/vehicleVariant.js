import axiosClient from "../config/axiosClient";

const getVehicleVariants = () => {
  return axiosClient.get("/api/variants");
};

const getVehicleVariantById = (id) => {
  return axiosClient.get(`/api/variants/${id}`);
};

const createVehicleVariant = (data) => {
  return axiosClient.post("/api/variants", data);
};

const deleteVehicleVariant = (id) => {
  return axiosClient.delete(`/api/variants/${id}`);
};

const updateVehicleVariant = (id, data) => {
  return axiosClient.put(`/api/variants/${id}`, data);
}

export { getVehicleVariants, getVehicleVariantById, createVehicleVariant, deleteVehicleVariant, updateVehicleVariant };
