import axiosClient from "../config/axiosClient";

// của evm staff
const getDealerDebtt = () => {
  return axiosClient.get(`/api/debts/dealer-debts`);
};

const getDeealerdebtById = (id) => {
  return axiosClient.get(`/api/debts/${id}`);
};

const getDealerDebtShedule = (id) => {
  return axiosClient.get(`/api/debts/${id}/schedules`);
};

// của dealer manager
const getDebt = (id) => {
  return axiosClient.get(`/api/debts/dealer/${id}`);
};

const makePayment = (debtId, paymentData) => {
  return axiosClient.post(`/api/debts/${debtId}/payments`, paymentData); //
};

const getPaymentHistory = (id) => {
  return axiosClient.get(`/api/debts/${id}/payments`);
};

export {
  getDealerDebtt,
  getDeealerdebtById,
  getDealerDebtShedule,
  getDebt,
  makePayment,
  getPaymentHistory,
};
