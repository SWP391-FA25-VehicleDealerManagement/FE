import axiosClient from "../config/axiosClient";

export const getCustomerDebt = async () => {
  return await axiosClient.get("/customer-debt");
};

export const getCustomerDebtById = async (id) => {
  return await axiosClient.get(`/customer-debt/${id}`);
};

export const createCustomerDebt = async (data) => {
  return await axiosClient.post("/customer-debt", data);
};

export const updateCustomerDebt = async (id, data) => {
  return await axiosClient.put(`/customer-debt/${id}`, data);
};

export const deleteCustomerDebt = async (id) => {
  return await axiosClient.delete(`/customer-debt/${id}`);
};


