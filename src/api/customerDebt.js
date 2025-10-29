import axiosClient from "../config/axiosClient";

const getCustomerDebt = async (dealerId) => {
  return await axiosClient.get(`/api/debts/customer-debts/${dealerId}`);
};

const getCustomerDebtById = (id) => {
  return axiosClient.get(`/api/debts/${id}`);
};

const getPaymentHistory = (id) => {
  return axiosClient.get(`/api/debts/${id}/payments`);
};

const getCustomerDebtSchedule = (id) => {
  return axiosClient.get(`/api/debts/${id}/schedules`);
};

export { getCustomerDebt, getCustomerDebtById, getPaymentHistory, getCustomerDebtSchedule };
