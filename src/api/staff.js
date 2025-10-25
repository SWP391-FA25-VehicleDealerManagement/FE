import axiosClient from "../config/axiosClient";

export const getAllStaffs = () => {
  return axiosClient.get("/api/staff");
};

export const getStaffById = (id) => {
  return axiosClient.get(`/api/staff/${id}`);
};

export const deleteStaff = (id) => {
  return axiosClient.delete(`/api/staff/${id}`);
};

export const createStaff = (data) => {
  return axiosClient.post("/api/staff", data);
};

export const updateStaff = (id, data) => {
  return axiosClient.put(`/api/staff/${id}`, data);
};
