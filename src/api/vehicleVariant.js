import axiosClient from "../config/axiosClient";

const getVehicleVariants = () => {
  return axiosClient.get("/api/variants");
};

const getVehicleVariantById = (id) => {
  return axiosClient.get(`/api/variants/${id}`);
};

const createVehicleVariant = (formData) => {
  return axiosClient.post("/api/variants", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteVehicleVariant = (id) => {
  return axiosClient.delete(`/api/variants/${id}`);
};

const updateVehicleVariant = (id, data) => {
  return axiosClient.put(`/api/variants/${id}`, data);
}

export { getVehicleVariants, getVehicleVariantById, createVehicleVariant, deleteVehicleVariant, updateVehicleVariant };
