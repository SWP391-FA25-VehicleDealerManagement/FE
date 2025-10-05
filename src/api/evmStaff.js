import axiosClient from "../config/axiosClient";

const getAllEvmStaff = () => {
    return axiosClient.get("/api/evm-staffs");
};
