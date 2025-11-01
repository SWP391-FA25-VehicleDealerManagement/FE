import axiosClient from "../config/axiosClient";

export const getAllEvmStaff = () => {
    return axiosClient.get("/api/evmstaff");
};
export const getEvmStaffById = (id) => {
    return axiosClient.get(`/api/evmstaff/${id}`);
};
export const createEvmStaff = (data) => {
    return axiosClient.post("/api/admin/create-evm-staff", data);
};
export const updateEvmStaff = (id, data) => {
    return axiosClient.put(`/api/evmstaff/${id}`, data);
}
export const deleteEvmStaff = (id) => {
    return axiosClient.delete(`/api/evmstaff/${id}`);
}
export default {
    getAllEvmStaff,
    getEvmStaffById,
    createEvmStaff,
    updateEvmStaff,
    deleteEvmStaff
};
