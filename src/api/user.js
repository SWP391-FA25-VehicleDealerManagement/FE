import axiosClient from "../config/axiosClient";

const updateUser = (data) => {
    return axiosClient.put(`/api/auth/update-user`, data);
}

export { updateUser };