import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getStaffSalesByDealer,
  getDealersSummary,
  getInventoryReport,
  getTurnoverReport,
} from "../api/report";

const useReport = create(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,

      /** cũ */
      staffSales: [],
      dealersSummary: [],
      inventoryReport: [],

      /** NEW: turnover report */
      turnoverReport: [],

      // ===== EXISTING ACTIONS (giữ nguyên) =====
      fetchStaffSales: async (dealerId) => {
        try {
          set({ isLoading: true, error: null });
          const res = await getStaffSalesByDealer(dealerId);
          const list = Array.isArray(res?.data?.data) ? res.data.data : [];
          const normalized = list.map((i) => ({
            ...i,
            totalOrders: Number(i?.totalOrders) || 0,
            totalRevenue: Number(i?.totalRevenue) || 0,
          }));
          set({ staffSales: normalized, isLoading: false });
        } catch (err) {
          console.error("fetchStaffSales error:", err);
          set({
            isLoading: false,
            error: err?.response?.data?.message || "Lỗi tải báo cáo",
          });
          throw err;
        }
      },

      fetchDealersSummary: async () => {
        try {
          set({ isLoading: true, error: null });
          const res = await getDealersSummary();
          const list = Array.isArray(res?.data?.data) ? res.data.data : [];
          const normalized = list.map((i) => ({
            ...i,
            dealerId: Number(i?.dealerId) || i?.dealerId,
            month: Number(i?.month) || i?.month,
            year: Number(i?.year) || i?.year,
            totalOrders: Number(i?.totalOrders) || 0,
            totalRevenue: Number(i?.totalRevenue) || 0,
          }));
          set({ dealersSummary: normalized, isLoading: false });
        } catch (err) {
          console.error("fetchDealersSummary error:", err);
          set({
            isLoading: false,
            error: err?.response?.data?.message || "Lỗi tải tổng hợp đại lý",
          });
          throw err;
        }
      },

      // bạn đã có fetchInventoryReport trước đó – giữ nguyên
      fetchInventoryReport: async () => {
        try {
          set({ isLoading: true, error: null });
          const res = await getInventoryReport();
          const list = Array.isArray(res?.data?.data) ? res.data.data : [];
          const normalized = list.map((i) => ({
            ...i,
            dealerId: Number(i?.dealerId) || i?.dealerId,
            totalVehicles: Number(i?.totalVehicles) || 0,
            availableVehicles: Number(i?.availableVehicles) || 0,
            soldVehicles: Number(i?.soldVehicles) || 0,
          }));
          set({ inventoryReport: normalized, isLoading: false });
        } catch (err) {
          console.error("fetchInventoryReport error:", err);
          set({
            isLoading: false,
            error: err?.response?.data?.message || "Lỗi tải tồn kho",
          });
          throw err;
        }
      },

      /** ===== NEW: turnover report ===== */
      fetchTurnoverReport: async () => {
        try {
          set({ isLoading: true, error: null });
          const res = await getTurnoverReport();
          const list = Array.isArray(res?.data?.data) ? res.data.data : [];
          const normalized = list.map((i) => ({
            ...i,
            dealerId: Number(i?.dealerId) || i?.dealerId,
            totalSold: Number(i?.totalSold) || 0,
            turnoverRate: Number(i?.turnoverRate) || 0, // 0.6666...
          }));
          set({ turnoverReport: normalized, isLoading: false });
        } catch (err) {
          console.error("fetchTurnoverReport error:", err);
          set({
            isLoading: false,
            error: err?.response?.data?.message || "Lỗi tải tốc độ tiêu thụ",
          });
          throw err;
        }
      },

      // ===== Helpers cũ =====
      totalOrders: () =>
        get().staffSales.reduce((s, i) => s + (Number(i.totalOrders) || 0), 0),
      totalRevenue: () =>
        get().staffSales.reduce((s, i) => s + (Number(i.totalRevenue) || 0), 0),
      summaryTotalOrders: () =>
        get().dealersSummary.reduce(
          (s, i) => s + (Number(i.totalOrders) || 0),
          0
        ),
      summaryTotalRevenue: () =>
        get().dealersSummary.reduce(
          (s, i) => s + (Number(i.totalRevenue) || 0),
          0
        ),
      summaryDealerCount: () => get().dealersSummary.length,

      // ===== NEW helpers cho turnover =====
      invTurnoverTotalSold: () =>
        get().turnoverReport.reduce(
          (s, i) => s + (Number(i.totalSold) || 0),
          0
        ),
      invTurnoverAvgRate: () => {
        const arr = get().turnoverReport;
        if (!arr.length) return 0;
        const sum = arr.reduce(
          (s, i) => s + (Number(i.turnoverRate) || 0),
          0
        );
        return sum / arr.length; // dạng 0.66
      },
      // helpers cho inventory (đã có từ trước)
      invTotalVehicles: () =>
        get().inventoryReport.reduce(
          (s, i) => s + (Number(i.totalVehicles) || 0),
          0
        ),
      invTotalAvailable: () =>
        get().inventoryReport.reduce(
          (s, i) => s + (Number(i.availableVehicles) || 0),
          0
        ),
      invTotalSold: () =>
        get().inventoryReport.reduce(
          (s, i) => s + (Number(i.soldVehicles) || 0),
          0
        ),
    }),
    {
      name: "report-store",
      partialize: (s) => ({
        staffSales: s.staffSales,
        dealersSummary: s.dealersSummary,
        inventoryReport: s.inventoryReport,
        turnoverReport: s.turnoverReport,
      }),
    }
  )
);

export default useReport;

