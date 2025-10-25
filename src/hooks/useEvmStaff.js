import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

const SEED = [
  { staffId: 1, staffName: "Nguyễn Minh A", phone: "0901234567", email: "a@evm.vn", role: "Sales", address: "Q.1, HCM" },
  { staffId: 2, staffName: "Trần Thu B",    phone: "0912345678", email: "b@evm.vn", role: "CSKH",  address: "Cầu Giấy, Hà Nội" },
  { staffId: 3, staffName: "Lê Hoàng C",    phone: "0934567890", email: "c@evm.vn", role: "Kỹ thuật", address: "Hải Châu, Đà Nẵng" },
];

const useEvmStaffStore = create(
  persist(
    (set, get) => ({
      evmStaffs: SEED,
      isLoading: false,
      evmStaffDetail: {},

      fetchEvmStaffs: async () => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 120));
        set({ isLoading: false });
      },

      fetchEvmStaffById: async (id) => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 100));
        const found = get().evmStaffs.find(s => String(s.staffId) === String(id)) || {};
        set({ isLoading: false, evmStaffDetail: found });
      },

      createEvmStaff: async (data) => {
        const nextId = (get().evmStaffs.at(-1)?.staffId || 0) + 1;
        const created = { staffId: nextId, ...data };
        set({ evmStaffs: [...get().evmStaffs, created] });
        toast.success("Tạo nhân viên EVM thành công!", { autoClose: 2500 });
        return created;
      },

      updateEvmStaff: async (id, patch) => {
        const updated = get().evmStaffs.map(s =>
          String(s.staffId) === String(id) ? { ...s, ...patch } : s
        );
        set({ evmStaffs: updated });
        toast.success("Cập nhật nhân viên EVM thành công!", { autoClose: 2500 });
      },

      deleteEvmStaff: async (id) => {
        const filtered = get().evmStaffs.filter(s => String(s.staffId) !== String(id));
        set({ evmStaffs: filtered });
        toast.success("Xoá nhân viên EVM thành công", { autoClose: 2500 });
      },
    }),
    { name: "evm-staffs", partialize: s => ({ evmStaffs: s.evmStaffs }) }
  )
);

export default useEvmStaffStore;
