import axiosClient from "../config/axiosClient";

const updateUser = (data) => {
  return axiosClient.put(`/api/auth/update-user`, data);
};

const changePassword = (data) => {
  return axiosClient.post(`/api/auth/change-password`, data);
};

export { updateUser, changePassword };
