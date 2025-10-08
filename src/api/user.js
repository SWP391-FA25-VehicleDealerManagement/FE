import axiosClient from "../config/axiosClient";

const updateUser = (data) => {
    return axiosClient.put(`/api/auth/me`, data);
}

export { updateUser };