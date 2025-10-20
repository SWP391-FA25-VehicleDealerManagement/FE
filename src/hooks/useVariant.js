import { create } from "zustand";
import {
  getVehicleVariants,
  getVehicleVariantById,
  createVehicleVariant,
  deleteVehicleVariant,
  updateVehicleVariant,
} from "../api/vehicleVariant";
const useVariantStore = create((set) => ({
  variants: [],
  isLoading: false,
  fetchVariants: async () => {
    set({ isLoading: true });
    try {
      const response = await getVehicleVariants();
      set({ variants: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch variants:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  variantDetail: {},
  fetchVariantById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await getVehicleVariantById(id);
      set({ variantDetail: response.data.data, isLoading: false });
      return response;
    } catch (error) {
      console.error("Failed to fetch variant by ID:", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createVariant: async (data) => {
    set({ isLoading: true });
    try {
      const response = await createVehicleVariant(data);
      set({ isLoading: false });
      return response;
    } catch (error) {
      console.error("Failed to create variant:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteVariant: async (id) => {
    set({ isLoading: true });
    try {
      const response = await deleteVehicleVariant(id);
      set({ isLoading: false });
      return response;
    } catch (error) {
      console.error("Failed to delete variant:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateVariant: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await updateVehicleVariant(id, data);
      set({ isLoading: false });
      return response;
    } catch (error) {
      console.error("Failed to update variant:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));

export default useVariantStore;
