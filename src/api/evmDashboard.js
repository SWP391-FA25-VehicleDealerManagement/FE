import axiosClient from "../config/axiosClient";

const getDealerData = async () => {
    return axiosClient.get(`/api/dealers/all/`);
}

const getDealerRequestData = async () => {
    return axiosClient.get(`/api/dealer-requests/status/DELIVERED`);
}

const getCustomerDebtData = async (dealerId) => {
    return axiosClient.get(`/api/debts/customer-debts/${dealerId}`);
}

const getDealerSaleData = async (year, month) => {
    return axiosClient.get(
      `/api/reports/dealer/summary?year=${year}&month=${month}`
    );
  }



export { getDealerData, getDealerRequestData, getCustomerDebtData, getDealerSaleData };