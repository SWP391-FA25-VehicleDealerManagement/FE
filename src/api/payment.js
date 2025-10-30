import axiosClient from "../config/axiosClient";

const getPayment = () => {
  return axiosClient.get("/api/payments");
};

const getPaymentById = (id) => {
  return axiosClient.get(`/api/payments/${id}`);
}

const createPayment = (data) => {
  return axiosClient.post("/api/payments", data);
};

const paymentSuccess = (id, status) => {
  return axiosClient.put(`/api/orders/${id}/status?status=${status}`);
}

export { getPayment, getPaymentById, createPayment, paymentSuccess };