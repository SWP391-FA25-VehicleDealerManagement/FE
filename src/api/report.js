import axiosClient from "../config/axiosClient";

export const getStaffSalesByDealer = (dealerId) => {
  if (!dealerId) throw new Error("dealerId is required");
  return axiosClient.get(`/api/reports/staff-sales/${dealerId}`);
};