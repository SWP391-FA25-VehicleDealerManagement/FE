import { create } from "zustand";
import {
  getAllStaffs,
  getStaffById,
  deleteStaff,
  createStaff,
  updateStaff,
} from "../api/staff"; // <-- nhớ tạo file api/staff.js giống dealer
import { toast } from "react-toastify";

const useStaffStore = create((set) => ({
  staffs: [],
  isLoading: false,

  fetchStaffs: async () => {
    try {
      set({ isLoading: true });
      const response = await getAllStaffs();
      console.log("Fetched staffs:", response);
      if (response && response.status === 200) {
        set({ isLoading: false, staffs: response.data.data || [] });
      }
    } catch (error) {
      console.error("Error fetching staffs:", error);
      set({ isLoading: false });
    }
  },

  staffDetail: {},
  fetchStaffById: async (id) => {
    try {
      set({ isLoading: true });
      const response = await getStaffById(id);
      if (response && response.status === 200) {
        set({ isLoading: false, staffDetail: response.data.data || {} });
      }
    } catch (error) {
      console.error("Error fetching staff by id:", error);
      set({ isLoading: false });
    }
  },

  deleteStaff: async (id) => {
    try {
      set({ isLoading: true });
      const response = await deleteStaff(id);
      if (response && response.status === 200) {
        set({ isLoading: false });
        toast.success("Xoá nhân viên thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(error.response?.data?.message || "Failed to delete staff", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      set({ isLoading: false });
    }
  },

  createStaff: async (staffData) => {
    try {
      set({ isLoading: true });
      const response = await createStaff(staffData);
      if (response && response.status === 201) {
        set({ isLoading: false });
        return response.data;
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateStaff: async (id, staffData) => {
    try {
      set({ isLoading: true });
      const response = await updateStaff(id, staffData);
      if (response && response.status === 200) {
        set({ isLoading: false });
        set({ staffDetail: response.data.data || {} });
        return response;
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));

export default useStaffStore;
