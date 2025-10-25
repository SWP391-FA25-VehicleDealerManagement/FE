import axiosClient from "../config/axiosClient";

const getDealerRequest = (dealerId) => {
  return axiosClient.get(`/api/dealer-requests/dealer/${dealerId}`);
};

const getDealerRequestById = (id) => {
  return axiosClient.get(`/api/dealer-requests/${id}`);
};

const createDealerRequest = (data) => {
  return axiosClient.post("/api/dealer-requests", data);
};

const confirmVehicleRequest = (id) => {
  return axiosClient.post(`/api/dealer-requests/${id}/deliver`);
};

export {
  getDealerRequest,
  createDealerRequest,
  getDealerRequestById,
  confirmVehicleRequest,
};
