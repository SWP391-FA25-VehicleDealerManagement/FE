import { create } from "zustand";
import {
  importInventory,
  getInventory,
  updateInventory,
  deleteInventory,
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

  importInventory: async (data) => {
    try {
      set({ isLoading: true });
      const response = await importInventory(data);
      if (response && response.status === 200) {
        set({ isLoading: false });
      }
      return response;
    } catch (error) {
      set({ isLoading: false });
      console.error("Error importing inventory:", error);
      throw error;
    }
  },
  updateInventory: async (id, data) => {
    try {
      const response = await updateInventory(id, data);
      if (response && response.status === 200) {
        set({ isLoading: false });
      }
      return response;
    } catch (error) {
      console.error("Error updating inventory:", error);
      set({ isLoading: false });
      throw error;
    }
  },
  deleteInventoryById: async (id) => {
    try {
      set({ isLoading: true });
      const response = await deleteInventory(id);
      if (response && response.status === 200) {
        set({ isLoading: false });
      }
      return response;
    } catch (error) {
      console.error("Error deleting inventory:", error);
      set({ isLoading: false });
      throw error;
    }
  },
  recallInventory: async () => {
    try {
      const response = await recallInventory();
      return response.data;
    } catch (error) {
      console.error("Error recalling inventory:", error);
      throw error;
    }
  },
  allocateInventory: async () => {
    try {
      const response = await allocateInventory();
      return response.data;
    } catch (error) {
      console.error("Error allocating inventory:", error);
      throw error;
    }
  },
}));

export default useInventoryStore;
