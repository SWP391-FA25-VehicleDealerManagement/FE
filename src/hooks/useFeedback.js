import { create } from "zustand";
import { toast } from "react-toastify";
import { getAllFeedbacks, getFeedbackById } from "../api/feedBack";

const useFeedback = create((set, get) => ({
  list: [],
  detail: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await getAllFeedbacks();
      // BE trả { success, message, data: [...] }
      const data = res?.data?.data ?? res?.data ?? [];
      set({ list: Array.isArray(data) ? data : [], isLoading: false });
    } catch (err) {
      console.error("fetchAll feedbacks error:", err);
      set({ isLoading: false, error: err, list: [] });
      toast.error("Không tải được danh sách phản hồi.");
    }
  },

  fetchById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const res = await getFeedbackById(id);
      const data = res?.data?.data ?? res?.data ?? null;
      set({ detail: data, isLoading: false });
    } catch (err) {
      console.error("fetchById feedback error:", err);
      set({ isLoading: false, error: err, detail: null });
      toast.error("Không tải được chi tiết phản hồi.");
    }
  },
}));

export default useFeedback;
