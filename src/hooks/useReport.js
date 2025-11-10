import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getStaffSalesByDealer,
  getDealersSummary,
  getInventoryReport,        // 👈 thêm import API tồn kho
} from "../api/report";

const useReport = create(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,

      /** Báo cáo theo nhân viên của 1 đại lý */
      staffSales: [],
      /** 🔥 MỚI: Báo cáo tổng hợp theo đại lý (toàn hệ thống) */
      dealersSummary: [],

      /** 🔥 MỚI: Báo cáo tồn kho theo đại lý (toàn hệ thống) */
      inventoryReport: [],

      /** Gọi API: nhân viên theo dealer */
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

      /** 🔥 Gọi API: tổng hợp theo đại lý */
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

      /** 🆕 Gọi API: báo cáo tồn kho theo đại lý */
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
            error: err?.response?.data?.message || "Lỗi tải báo cáo tồn kho",
          });
          throw err;
        }
      },

      // Helpers: tổng hợp staffSales
      totalOrders: () =>
        get().staffSales.reduce((s, i) => s + (Number(i.totalOrders) || 0), 0),
      totalRevenue: () =>
        get().staffSales.reduce((s, i) => s + (Number(i.totalRevenue) || 0), 0),

      // 🔥 Helpers: tổng hợp dealersSummary
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

      // 🆕 Helpers: tổng hợp inventoryReport
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
      // Persist những mảng dữ liệu lớn để không gọi lại khi chuyển trang
      partialize: (s) => ({
        staffSales: s.staffSales,
        dealersSummary: s.dealersSummary,
        inventoryReport: s.inventoryReport, // 👈 lưu thêm tồn kho
      }),
    }
  )
);

export default useReport;
