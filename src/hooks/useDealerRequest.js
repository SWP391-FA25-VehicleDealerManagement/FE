import { create } from "zustand";
import {
  getDealerRequest,
  createDealerRequest,
  getDealerRequestById,
} from "../api/dealerRequest";

const useDealerRequest = create((set) => ({
  requestLists: [],
  isLoading: false,
  createRequestVehicle: async (data) => {
    try {
      set({ isLoading: true });
      const response = createDealerRequest(data);
      if (response && response.status === 200) {
        set({ isLoading: false });
      }
      return response;
    } catch (error) {
      console.log("Error at create dealer request", error);
      set({ isLoading: false });
    }
  },
}));

export default useDealerRequest;
