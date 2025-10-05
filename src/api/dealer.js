import axiosClient from "../config/axiosClient";

const getAllDealers = () => {
  return axiosClient.get("/api/dealers");
};


export { getAllDealers };


