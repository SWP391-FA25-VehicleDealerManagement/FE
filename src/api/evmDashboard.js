import axiosClient from "../config/axiosClient";

const getDealerData = async () => {
  return axiosClient.get(`/api/dealers/all`);
};

const getDealerRequestData = async () => {
  return axiosClient.get(`/api/dealer-requests`);
};

const getDealerSaleData = async (year, month) => {
  return axiosClient.get(
    `/api/reports/dealers/summary?year=${year}&month=${month}`
  );
};

const getDealerDebtData = async () => {
  return axiosClient.get(`/api/debts/dealer-debts`);
};

const getEvmStaffData = async () => {
  return axiosClient.get(`/api/evmstaff`);
}

export {
  getDealerData,
  getDealerRequestData,
  getDealerDebtData,
  getDealerSaleData,
  getEvmStaffData,
};
