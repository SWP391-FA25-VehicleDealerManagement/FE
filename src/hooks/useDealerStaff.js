import { create } from "zustand";
import { getDealerStaffByDealerId, getUserById } from "../api/dealerStaff";

const useDealerStaff = create((set) => ({
  staffs: [],
  staffDetail: {},
  isLoading: false,
  error: null,

  // Lấy danh sách nhân viên theo dealerId
  fetchStaffs: async (dealerId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await getDealerStaffByDealerId(dealerId);
      set({ staffs: res?.data?.data || [], isLoading: false });
    } catch (err) {
      console.error("Error fetching dealer staff:", err);
      set({ isLoading: false, error: err, staffs: [] });
      toast.error("Không tải được danh sách nhân viên.");
    }
  },

  // Lấy chi tiết 1 nhân viên theo userId
  fetchStaffById: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await getUserById(userId);
      set({ staffDetail: res?.data?.data || {}, isLoading: false });
    } catch (err) {
      console.error("Error fetching staff by id:", err);
      set({ isLoading: false, error: err });
      toast.error("Không tải được chi tiết nhân viên.");
    }
  },

  // Các API chưa có backend — giữ stub để không vỡ UI
  deleteStaff: async () => {
    toast.info("Xoá nhân viên hiện chưa được hỗ trợ bởi API.");
    return Promise.reject(new Error("Not supported"));
  },

  createStaff: async () => {
    toast.info("Tạo nhân viên hiện chưa được hỗ trợ bởi API.");
    return Promise.reject(new Error("Not supported"));
  },

  updateStaff: async () => {
    toast.info("Cập nhật nhân viên hiện chưa được hỗ trợ bởi API.");
    return Promise.reject(new Error("Not supported"));
  },
}));

export default useDealerStaff;
