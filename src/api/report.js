import axiosClient from "../config/axiosClient";

export const getStaffSalesByDealer = (dealerId) => {
  if (!dealerId) throw new Error("dealerId is required");
  return axiosClient.get(`/api/reports/staff-sales/${dealerId}`);
};

export const getDealersSummary = () => {
  return axiosClient.get("/api/reports/dealers/summary");
};

export const getInventoryReport = () => {
  return axiosClient.get("/api/reports/inventory");
};