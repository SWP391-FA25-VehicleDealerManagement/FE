import axiosClient from "../config/axiosClient";

const getStaffSalesData = async (dealerId) => {
  return axiosClient.get(`/api/reports/staff-sales/${dealerId}`);
};



export { getStaffSalesData };
