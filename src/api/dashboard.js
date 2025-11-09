import axiosClient from "../config/axiosClient";

const getStaffSalesData = async (dealerId, year, month) => {
  return axiosClient.get(
    `/api/reports/staff-sales/${dealerId}?year=${year}&month=${month}`
  );
};

const getDealerCustomerData = async (dealerId) => {
  return axiosClient.get(`/api/customers/dealer/${dealerId}`);
};

const getDealerOrderData = async (dealerId) => {
  return axiosClient.get(`/api/orders/dealer/${dealerId}`);
};

const getCustomerDebtData = async (dealerId) => {
  return axiosClient.get(`/api/debts/customer-debts/${dealerId}`);
};

const getDealerEvmDebtData = async (dealerId) => {
  return axiosClient.get(`/api/reports/dealer-evm-debts/${dealerId}`);
};

const getDealerRevenueData = async (dealerId, year, month) => {
  return axiosClient.get(
    `/api/reports/dealer-sales?dealerId=${dealerId}&year=${year}&month=${month}`
  );
};

const getDealerDebtData = async (dealerId) => {
  return axiosClient.get(`/api/debts/dealer/${dealerId}`);
};

const getStaffData = async (dealerId) => {
  return axiosClient.get(`/api/users/dealer/${dealerId}/staff`);
}

export {
  getStaffSalesData,
  getDealerCustomerData,
  getDealerOrderData,
  getCustomerDebtData,
  getDealerEvmDebtData,
  getDealerRevenueData,
  getDealerDebtData,
  getStaffData,
};
