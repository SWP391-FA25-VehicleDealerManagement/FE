import { create } from "zustand";
import {
  getAllVehicles,
  getVehicleById,
  getVehicleDealers,
  deleteVehicle,
  createVehicle,
  updateVehicle,
} from "../api/vehicle";

const useVehicleStore = create((set) => ({
  vehicles: [],
  isLoading: false,
  fetchVehicles: async () => {
    try {
      set({ isLoading: true });
      const response = await getAllVehicles();
      set({ vehicles: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  vehicleDetail: {},
  fetchVehicleById: async (id) => {
    try {
      set({ isLoading: true });
      const response = await getVehicleById(id);
      set({ isLoading: false, vehicleDetail: response.data.data });
      return response.data.data;
    } catch (error) {
      set({ isLoading: false });
      return null;
    }
  },

  updateVehicle: async (id, data) => {
    try {
      const response = await updateVehicle(id, data);
      return response.data;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      throw error;
    }
  },

  deleteVehicleById: async (id) => {
    try {
      const response = await deleteVehicle(id);
      return response.data;
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      throw error;
    }
  },

  createNewVehicle: async (data) => {
    try {
      const response = await createVehicle(data);
      return response.data;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  },


  dealerCarLists: [],
  fetchVehicleDealers: async (id) => {
    try {
      set({ isLoading: true });
      const response = await getVehicleDealers(id);
      set({ isLoading: false, dealerCarLists: response.data.data });
      return response;
    } catch (error) {
      set({ isLoading: false });
      console.error("Error fetching vehicle dealers:", error);
      throw error;
    }
  },
}));

export default useVehicleStore;
