import axiosClient from "../config/axiosClient";

const getAppointments = async (params) => {
  return await axiosClient.get("/appointments", { params });
};
