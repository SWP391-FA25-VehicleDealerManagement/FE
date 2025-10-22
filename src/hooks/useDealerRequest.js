import { create } from "zustand";
import {
  getDealerRequest,
  createDealerRequest,
  getDealerRequestById,
  confirmVehicleRequest,
} from "../api/dealerRequest";

const useDealerRequest = create((set) => ({
  requestLists: [],
  requestDetail: null,
  isLoading: false,
  error: null,

  // Fetch all requests by dealer ID
  fetchRequestsByDealer: async (dealerId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getDealerRequest(dealerId);

      if (response && response.data) {
        set({
          requestLists: response.data.data || [],
          isLoading: false,
        });
        return response.data.data;
      }
      set({ isLoading: false });
      return [];
    } catch (error) {
      console.error("Error fetching dealer requests:", error);
      set({
        error: error.message || "Failed to fetch requests",
        isLoading: false,
        requestLists: [],
      });
      return [];
    }
  },

  // Fetch request detail by ID
  fetchRequestById: async (requestId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getDealerRequestById(requestId);

      if (response && response.data) {
        set({
          requestDetail: response.data.data || null,
          isLoading: false,
        });
        return response.data.data;
      }
      set({ isLoading: false });
      return null;
    } catch (error) {
      console.error("Error fetching request detail:", error);
      set({
        error: error.message || "Failed to fetch request detail",
        isLoading: false,
        requestDetail: null,
      });
      return null;
    }
  },

  // Create new request
  createRequestVehicle: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await createDealerRequest(data);

      if (response && response.data) {
        set({ isLoading: false });
        return response;
      }
      set({ isLoading: false });
      return null;
    } catch (error) {
      console.error("Error creating dealer request:", error);
      set({
        error: error.message || "Failed to create request",
        isLoading: false,
      });
      throw error;
    }
  },

  // Confirm vehicle request (change status to ALLOCATED)
  isLoadingConfirmRequest: false,
  confirmRequestReceived: async (id, name) => {
    try {
      set({ isLoadingConfirmRequest: true });
      const response = await confirmVehicleRequest(id, name);
      if (response && response.status === 200) {
        set({ isLoadingConfirmRequest: false });
      }
      return response;
    } catch (error) {
      set({ isLoadingConfirmRequest: false });
      console.error("Error confirming request:", error);
      throw error;
    }
  },
}));

export default useDealerRequest;
