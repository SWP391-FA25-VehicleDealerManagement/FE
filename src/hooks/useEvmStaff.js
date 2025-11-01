import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import {
  getAllEvmStaff,
  getEvmStaffById,
  createEvmStaff as apiCreate,
  updateEvmStaff as apiUpdate,
  deleteEvmStaff as apiDelete,
} from "../api/evmStaff";

const useEvmStaffStore = create(
  persist(
    (set, get) => ({
      evmStaffs: [],
      isLoading: false,
      staffDetail: {},

      fetchEvmStaffs: async () => {
        set({ isLoading: true });
        try {
          const res = await getAllEvmStaff();
          console.log("GET /api/evmstaff response:", res);
          const list = res?.data?.data ?? res?.data ?? [];
          set({ evmStaffs: Array.isArray(list) ? list : [], isLoading: false });
        } catch (err) {
          console.error("fetchEvmStaffs error:", err);
          set({ evmStaffs: [], isLoading: false });
          toast.error("Không tải được danh sách nhân viên từ server.");
        }
      },

      fetchEvmStaffById: async (id) => {
        set({ isLoading: true });
        try {
          const res = await getEvmStaffById(id);
          console.log(`GET /api/evmstaff/${id} response:`, res);
          const detail = res?.data?.data ?? res?.data ?? {};
          set({ staffDetail: detail, isLoading: false });
        } catch (err) {
          console.error("fetchEvmStaffById error:", err);
          set({ staffDetail: {}, isLoading: false });
          toast.error("Không tải được chi tiết nhân viên từ server.");
        }
      },

      createEvmStaff: async (data) => {
        set({ isLoading: true });
        try {
          const res = await apiCreate(data);
          console.log("POST /api/evmstaff response:", res);
          const created = res?.data?.data ?? res?.data ?? null;
          if (created) {
            set({ evmStaffs: [...get().evmStaffs, created], isLoading: false });
            toast.success("Tạo nhân viên EVM thành công!");
            return created;
          }
          set({ isLoading: false });
          throw new Error("Invalid create response");
        } catch (err) {
          console.error("createEvmStaff error:", err);
          set({ isLoading: false });
          toast.error("Tạo nhân viên thất bại.");
          throw err;
        }
      },

      updateEvmStaff: async (id, patch) => {
        set({ isLoading: true });
        try {
          const res = await apiUpdate(id, patch);
          console.log(`PUT /api/evmstaff/${id} response:`, res);
          const updated = res?.data?.data ?? res?.data ?? null;
          if (updated) {
            set({
              evmStaffs: get().evmStaffs.map((s) =>
                String(s.staffId ?? s.id ?? s.userId) === String(id) ? updated : s
              ),
              isLoading: false,
            });
            toast.success("Cập nhật nhân viên thành công!");
            return updated;
          }
          set({ isLoading: false });
          throw new Error("Invalid update response");
        } catch (err) {
          console.error("updateEvmStaff error:", err);
          set({ isLoading: false });
          toast.error("Cập nhật thất bại.");
          throw err;
        }
      },

      deleteEvmStaff: async (id) => {
        set({ isLoading: true });
        try {
          const res = await apiDelete(id);
          console.log(`DELETE /api/evmstaff/${id} response:`, res);
          set({
            evmStaffs: get().evmStaffs.filter(
              (s) => String(s.staffId ?? s.id ?? s.userId) !== String(id)
            ),
            isLoading: false,
          });
          toast.success("Xoá nhân viên thành công.");
        } catch (err) {
          console.error("deleteEvmStaff error:", err);
          set({ isLoading: false });
          toast.error("Xoá thất bại.");
          throw err;
        }
      },
    }),
    { name: "evm-staffs", partialize: (s) => ({ evmStaffs: s.evmStaffs }) }
  )
);

export default useEvmStaffStore;