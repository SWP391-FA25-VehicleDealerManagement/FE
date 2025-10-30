import { create } from "zustand";
import {
  createSalePrice,
  updateSalePrice,
  deleteSalePrice,
} from "../api/saleprice";
const useSalePrice = create((set) => ({
  isLoadingCreateSalePrice: false,
  createSalePrice: async (data) => {
    set({ isLoadingCreateSalePrice: true });
    try {
      await createSalePrice(data);
    } catch (error) {
      console.error("Error creating sale price:", error);
    } finally {
      set({ isLoadingCreateSalePrice: false });
    }
  },
}));

export default useSalePrice;
