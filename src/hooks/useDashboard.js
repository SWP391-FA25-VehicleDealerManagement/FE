import {create} from 'zustand';
import {getStaffSalesData} from '../api/dashboard';

const useDashboard = create((set) => ({
  staffSalesData: null,
  fetchStaffSalesData: async (dealerId) => {
   
  },
}));

export default useDashboard;
