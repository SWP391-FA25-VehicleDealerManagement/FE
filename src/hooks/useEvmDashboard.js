import { create } from "zustand";
import {
  getEvmStaffData,
  getDealerRequestData,
  getDealerSaleData,
  getDealerData,
  getDealerDebtData,
} from "../api/evmDashboard";

const useEvmDashboard = create((set) => ({
  // Data states
  evmStaffData: null,
  dealerRequestData: null,
  dealerSaleData: null,
  dealerData: null,
  dealerDebtData: null,

  // Loading state
  isLoading: false,

  // Fetch EVM staff data
  fetchEvmStaffData: async () => {
    try {
      const response = await getEvmStaffData();
      if (response.data.success) {
        set({ evmStaffData: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching EVM staff data:", error);
    }
  },

  // Fetch dealer request data
  fetchDealerRequestData: async () => {
    try {
      const response = await getDealerRequestData();
      if (response.data.success) {
        set({ dealerRequestData: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching dealer request data:", error);
    }
  },

  // Fetch dealer sale data
  fetchDealerSaleData: async (year, month) => {
    try {
      const response = await getDealerSaleData(year, month);
      if (response.data.success) {
        set({ dealerSaleData: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching dealer sale data:", error);
    }
  },

  // Fetch dealer data
  fetchDealerData: async () => {
    try {
      const response = await getDealerData();
      if (response.data.success) {
        set({ dealerData: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching dealer data:", error);
    }
  },

  // Fetch dealer debt data
  fetchDealerDebtData: async () => {
    try {
      const response = await getDealerDebtData();
      if (response.data.success) {
        set({ dealerDebtData: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching dealer debt data:", error);
    }
  },

  // Fetch all dashboard data
  fetchAllEvmDashboardData: async (year, month) => {
    set({ isLoading: true });
    try {
      await Promise.all([
        useEvmDashboard.getState().fetchEvmStaffData(),
        useEvmDashboard.getState().fetchDealerRequestData(),
        useEvmDashboard.getState().fetchDealerSaleData(year, month),
        useEvmDashboard.getState().fetchDealerData(),
        useEvmDashboard.getState().fetchDealerDebtData(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear all data
  clearData: () => {
    set({
      evmStaffData: null,
      dealerRequestData: null,
      dealerSaleData: null,
      dealerData: null,
      dealerDebtData: null,
    });
  },
}));

export default useEvmDashboard;
