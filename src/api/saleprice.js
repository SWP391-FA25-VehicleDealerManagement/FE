import axiosClient from "../config/axiosClient";

const createSalePrice = (data) => {
    return axiosClient.post("/sale-prices", data);
}

const updateSalePrice = (id, data) => {
    return axiosClient.put(`/sale-prices/${id}`, data);
}

const deleteSalePrice = (id) => {
    return axiosClient.delete(`/sale-prices/${id}`);
}

export { createSalePrice, updateSalePrice, deleteSalePrice };

