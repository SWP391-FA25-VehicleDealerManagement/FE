import axiosClient from "../config/axiosClient";

const getVehicleVariants = () => {
  return axiosClient.get("/api/variants");
};

const getVehicleVariantById = (id) => {
  return axiosClient.get(`/api/variants/${id}`);
};

const getVehicleVariantDetails = (id) => {
  return axiosClient.get(`/api/variants/${id}/details`);
};

const createVehicleVariant = (formData) => {
  return axiosClient.post("/api/variants", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const createVehicleVariantDetails = (id, data) => {
  return axiosClient.post(`/api/variants/${id}/details`, data);
};

const deleteVehicleVariant = (id) => {
  return axiosClient.delete(`/api/variants/${id}`);
};

const updateVehicleVariant = (id, formData) => {
  return axiosClient.put(`/api/variants/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateVehicleVariantDetails = (id, data) => {
  return axiosClient.put(`/api/variants/${id}/details`, data);
};

export {
  getVehicleVariants,
  getVehicleVariantById,
  createVehicleVariant,
  deleteVehicleVariant,
  updateVehicleVariant,
  getVehicleVariantDetails,
  createVehicleVariantDetails,
  updateVehicleVariantDetails,
};
