import { create } from "zustand";
import {
  getAllVehicles,
  getVehicleById,
  getVehicleDealers,
  deleteVehicle,
  createVehicle,
  updateVehicle,
  getEVMVehicles,
  getTestDriverVehicles,
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

  evmVehiclesList: [],
  isLoadingEVMVehicles: false,
  fetchEVMVehicles: async () => {
    try {
      set({ isLoadingEVMVehicles: true });
      const response = await getEVMVehicles();
      if (response && response.status === 200) {
        set({
          evmVehiclesList: response.data.data,
          isLoadingEVMVehicles: false,
        });
      }
      return response;
    } catch (error) {
      console.log("error at fetchEVMVehicles", error);
      set({ isLoadingEVMVehicles: false });
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
      if (response && response.status === 200) {
        set({ isLoading: false });
      }
      return response;
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      throw error;
    }
  },

  createNewVehicle: async (data) => {
    try {
      const response = await createVehicle(data);
      if (response && response.status === 200) {
        set({ isLoading: false });
      }
      return response;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      throw error;
    }
  },

  dealerCarLists: [],
  isLoadingVehicleDealers: false,
  fetchVehicleDealers: async (id) => {
    try {
      set({ isLoadingVehicleDealers: true });
      const response = await getVehicleDealers(id);
      set({
        isLoadingVehicleDealers: false,
        dealerCarLists: response.data.data,
      });
      return response;
    } catch (error) {
      set({ isLoadingVehicleDealers: false });
      console.error("Error fetching vehicle dealers:", error);
      throw error;
    }
  },

  testDriveVehicle: [],
  isLoadingTestDriveVehicles: false,
  fetchTestDriverVehicles: async () => {
    try {
      set({ isLoadingTestDriveVehicles: true });
      const response = await getTestDriverVehicles();
      if (response && response.status === 200) {
        set({
          isLoadingTestDriveVehicles: false,
          testDriveVehicle: response.data.data,
        });
      }
      return response;
    } catch (error) {
      console.log("error at fetchTestDriverVehicles", error);
      set({ isLoadingTestDriveVehicles: false });
      throw error;
    }
  },
}));

export default useVehicleStore;
