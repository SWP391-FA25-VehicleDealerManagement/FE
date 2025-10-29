import axiosClient from "../config/axiosClient";

const createSalePrice = (data) => {
    return axiosClient.post("/api/sale-prices", data);
}

const updateSalePrice = (id, data) => {
    return axiosClient.put(`/api/sale-prices/${id}`, data);
}

const deleteSalePrice = (id) => {
    return axiosClient.delete(`/api/sale-prices/${id}`);
}

export { createSalePrice, updateSalePrice, deleteSalePrice };

