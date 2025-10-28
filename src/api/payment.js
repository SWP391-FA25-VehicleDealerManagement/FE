import axiosClient from "../config/axiosClient";

const getPayment = () => {
  return axiosClient.get("/api/payments");
};

const createPayment = (data) => {
  return axiosClient.post("/api/payments", data);
};
export { getPayment, createPayment };