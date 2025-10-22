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

const confirmVehicleRequest = (id, name) => {
  return axiosClient.put(
    `/api/dealer-requests/${id}/status?status=ALLOCATED&approvedBy=${name}`
  );
};

export { getDealerRequest, createDealerRequest, getDealerRequestById, confirmVehicleRequest };
