import { create } from "zustand";
import { getCustomerDebt } from "../api/customerDebt";

const useCustomerDebt = create((set) => ({
  customerDebtsList: [],
  isLoadingCustomerDebts: false,
  fetchCustomerDebtsById: async (dealerId) => {
    set({ isLoadingCustomerDebts: true });
    try {
      const response = await getCustomerDebt(dealerId);
      if (response && response.status === 200) {
        set({
          customerDebtsList: response.data.data,
          isLoadingCustomerDebts: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch customer debts:", error);
      set({ isLoadingCustomerDebts: false });
    }
  },
}));

export default useCustomerDebt;
