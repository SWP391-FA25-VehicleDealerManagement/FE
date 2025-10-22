import axiosClient from "../config/axiosClient";

const getVehicleRequests = () => {
  return axiosClient.get("/api/dealer-requests");
};

const getVehicleRequestsDetail = (id) => {
  return axiosClient.get(`/api/dealer-requests/${id}`);
};

const getVehicleRequestsPending = () => {
  return axiosClient.get("/api/dealer-requests/pending");
};

const approveVehicleRequest = (id, name) => {
  return axiosClient.put(
    `/api/dealer-requests/${id}/status?status=APPROVED&approvedBy=${name}`
  );
};

const rejectVehicleRequest = (id, name) => {
  return axiosClient.put(
    `/api/dealer-requests/${id}/status?status=REJECTED&approvedBy=${name}`
  );
};



export {
  getVehicleRequests,
  getVehicleRequestsPending,
  getVehicleRequestsDetail,
  approveVehicleRequest,
  rejectVehicleRequest,
};

