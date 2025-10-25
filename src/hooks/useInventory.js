import { create } from "zustand";
import {
  getInventory,
  recallInventory,
  allocateInventory,
} from "../api/inventory";

const useInventoryStore = create((set) => ({
  inventory: [],
  isLoading: false,
  fetchInventory: async () => {
    try {
      set({ isLoading: true });
      const response = await getInventory();
      if (response && response.status === 200) {
        set({ inventory: response.data.data, isLoading: false });
      }
      return response;
    } catch (error) {
      set({ isLoading: false });
    }
  },

  
  isLoadingRecall: false,
  recallInventory: async (data) => {
    try {
      const response = await recallInventory(data);
      if (response && response.status === 200) {
        set({ isLoadingRecall: false });
      }
      return response;
    } catch (error) {
      console.error("Error recalling inventory:", error);
      throw error;
    }
  },
  
  isLoadingAllocate: false,
  allocateInventory: async (data) => {
    try {
      const response = await allocateInventory(data);
      if (response && response.status === 200) {
        set({ isLoadingAllocate: false });
      }
      return response;
    } catch (error) {
      set({ isLoading: false });
      console.error("Error allocating inventory:", error);
      throw error;
    }
  },
}));

export default useInventoryStore;
