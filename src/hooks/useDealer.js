import { create } from "zustand";
import { getAllDealers } from "../api/dealer";
const useDealerStore = create((set) => ({
  dealers: [],
  isLoading: false,
  fetchDealers: async () => {
    try {
      set({ isLoading: true });
      const response = await getAllDealers();
      console.log("Fetched dealers:", response);
      if (response && response.status === 200) {
        set({ isLoading: false, dealers: response.data.data || [] });
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
      set({ isLoading: false });
    }
  },
}));

export default useDealerStore;
