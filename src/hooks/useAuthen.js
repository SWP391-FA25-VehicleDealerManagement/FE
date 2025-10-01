import { create } from "zustand";
import Cookies from "js-cookie";
import { notification } from "antd";
import { login, logout as logoutAPI } from "../api/authen.js";

const useAuthen = create((set, get) => ({
  isLoading: false,
  role: null,
  userDetail: null,
  isAuthenticated: false,
  isInitialized: false,

  login: async (values) => {
    set({ isLoading: true });
    try {
      const response = await login(values);
      if (response && response.data && response.data.success) {
        const user = response.data.data?.user;
        const accessToken = response.data.data?.accessToken;

        if (!user || !user.role) {
          set({ isLoading: false });
          notification.error({
            message: "Login Failed",
            description: "Invalid response format from server",
            duration: 1,
          });
          return false;
        }

        // Save to storage
        Cookies.set("token", accessToken);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userDetail", JSON.stringify(user));

        // Update state
        set({
          userDetail: user,
          role: user.role,
          isLoading: false,
          isAuthenticated: true,
          isInitialized: true,
        });

        notification.success({
          message: "Login Successful",
          description: response.data.message || "Login successful",
          duration: 1,
        });

        return { success: true, role: user.role };
      }

      set({ isLoading: false, isInitialized: true });
      notification.error({
        message: "Login Failed",
        description: "Invalid response format from server",
        duration: 3,
        placement: "topRight",
      });
      return { success: false };
    } catch (err) {
      console.log("Login error", err);
      set({ isLoading: false, isInitialized: true });
      notification.error({
        message: "Login Failed",
        description:
          err.response?.data?.message || "Invalid credentials or server error",
        duration: 1,
      });
      return { success: false };
    }
  },

  logout: async () => {
    try {
      await logoutAPI();

      Cookies.remove("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userDetail");

      set({
        userDetail: null,
        role: null,
        isAuthenticated: false,
        isInitialized: true,
      });

      notification.success({
        message: "Logout Successful",
        description: "You have been logged out successfully",
        duration: 1,
      });

      return true;
    } catch (err) {
      console.log("Logout error", err);

      Cookies.remove("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userDetail");

      set({
        userDetail: null,
        role: null,
        isAuthenticated: false,
        isInitialized: true,
      });

      return false;
    }
  },

  initAuth: () => {
    const token = Cookies.get("token");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    const userDetail = localStorage.getItem("userDetail");

    if (token && isAuthenticated === "true" && userRole && userDetail) {
      try {
        set({
          isAuthenticated: true,
          role: userRole,
          userDetail: JSON.parse(userDetail),
          isInitialized: true,
        });
      } catch (err) {
        console.error("Error parsing stored user data:", err);
        Cookies.remove("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userDetail");
        set({
          isAuthenticated: false,
          role: null,
          userDetail: null,
          isInitialized: true,
        });
      }
    } else {
      // Clear any invalid data
      Cookies.remove("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userDetail");
      set({
        isAuthenticated: false,
        role: null,
        userDetail: null,
        isInitialized: true,
      });
    }
  },

}));

export default useAuthen;
