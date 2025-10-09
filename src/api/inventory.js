import axiosClient from "../config/axiosClient";

// Định nghĩa các endpoint API cho inventory
const BASE_URL = "/inventory";

const inventoryApi = {
  // Lấy danh sách inventory
  getAllInventory: (params) => {
    return axiosClient.get(`${BASE_URL}`, { params });
  },

  // Lấy chi tiết inventory theo ID
  getInventoryById: (id) => {
    return axiosClient.get(`${BASE_URL}/${id}`);
  },

  // Thêm mới inventory
  createInventory: (data) => {
    return axiosClient.post(`${BASE_URL}`, data);
  },

  // Cập nhật inventory
  updateInventory: (id, data) => {
    return axiosClient.put(`${BASE_URL}/${id}`, data);
  },

  // Xóa inventory
  deleteInventory: (id) => {
    return axiosClient.delete(`${BASE_URL}/${id}`);
  },

  // Lấy danh sách kho
  getAllWarehouses: () => {
    return axiosClient.get(`${BASE_URL}/warehouses`);
  },

  // Thêm mới kho
  createWarehouse: (data) => {
    return axiosClient.post(`${BASE_URL}/warehouses`, data);
  },

  // Phân bổ xe cho đại lý
  allocateVehicles: (data) => {
    return axiosClient.post(`${BASE_URL}/allocate`, data);
  },

  // Lấy lịch sử phân bổ
  getAllocationHistory: (params) => {
    return axiosClient.get(`${BASE_URL}/allocations`, { params });
  },

  // Import xe vào kho
  importVehicles: (data) => {
    return axiosClient.post(`${BASE_URL}/import`, data);
  },
};

export default inventoryApi;