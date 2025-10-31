import axiosClient from "../config/axiosClient";

// Lấy danh sách nhân viên của 1 đại lý
export const getDealerStaffByDealerId = (dealerId) => {
  return axiosClient.get(`/api/users/dealer/${dealerId}/staff`);
};

// (tuỳ chọn) lấy chi tiết 1 nhân viên
export const getUserById = (userId) => {
  return axiosClient.get(`/api/users/${userId}`);
};

export const createDealerStaff = (data) => {
  return axiosClient.post(`/api/admin/create-dealer-staff`, data);
};