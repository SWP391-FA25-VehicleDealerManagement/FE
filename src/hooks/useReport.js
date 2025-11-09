import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getStaffSalesByDealer } from "../api/report";

const useReport = create(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,
      /** mảng các object: { userId, fullName, userName, phone, email, role, dealerName, totalOrders, totalRevenue } */
      staffSales: [],

      /** Gọi API duy nhất để lấy báo cáo */
      fetchStaffSales: async (dealerId) => {
        try {
          set({ isLoading: true, error: null });
          const res = await getStaffSalesByDealer(dealerId);
          // backend trả về { success, message, data: [...] }
          const list = res?.data?.data ?? [];
          set({ staffSales: Array.isArray(list) ? list : [], isLoading: false });
        } catch (err) {
          console.error("fetchStaffSales error:", err);
          set({ isLoading: false, error: err?.response?.data?.message || "Lỗi tải báo cáo" });
          throw err;
        }
      },

      // Helpers tổng hợp
      totalOrders: () => get().staffSales.reduce((s, i) => s + (Number(i.totalOrders) || 0), 0),
      totalRevenue: () => get().staffSales.reduce((s, i) => s + (Number(i.totalRevenue) || 0), 0),
    }),
    {
      name: "report-store",
      partialize: (s) => ({ staffSales: s.staffSales }),
    }
  )
);

export default useReport;
