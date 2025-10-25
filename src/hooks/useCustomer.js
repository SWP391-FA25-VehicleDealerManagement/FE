import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

const SEED = [
  { customerId: 1, customerName: "Phạm Quốc D", phone: "0901112222", address: "Q.1, HCM", note: "Lead nóng" },
  { customerId: 2, customerName: "Vũ Thu E",    phone: "0913334444", address: "Cầu Giấy, Hà Nội", note: "Hẹn lái thử" },
  { customerId: 3, customerName: "Lâm Hữu F",    phone: "0935556666", address: "Hải Châu, Đà Nẵng", note: "" },
];

const useCustomerStore = create(
  persist(
    (set, get) => ({
      customers: SEED,
      isLoading: false,
      customerDetail: {},

      fetchCustomers: async () => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 120));
        set({ isLoading: false });
      },
      fetchCustomerById: async (id) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 100));
        const found = get().customers.find(c => String(c.customerId) === String(id)) || {};
        set({ isLoading: false, customerDetail: found });
      },
      createCustomer: async (data) => {
        const nextId = (get().customers.at(-1)?.customerId || 0) + 1;
        const created = { customerId: nextId, ...data };
        set({ customers: [...get().customers, created] });
        toast.success("Tạo khách hàng thành công!", { autoClose: 2500 });
        return created;
      },
      updateCustomer: async (id, patch) => {
        const updated = get().customers.map(c =>
          String(c.customerId) === String(id) ? { ...c, ...patch } : c
        );
        set({ customers: updated });
        toast.success("Cập nhật khách hàng thành công!", { autoClose: 2500 });
      },
      deleteCustomer: async (id) => {
        const filtered = get().customers.filter(c => String(c.customerId) !== String(id));
        set({ customers: filtered });
        toast.success("Xoá khách hàng thành công", { autoClose: 2500 });
      },
    }),
    { name: "dealer-staff-customers", partialize: s => ({ customers: s.customers }) }
  )
);

export default useCustomerStore;
