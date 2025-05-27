import { create } from "zustand";

import { AuthUser } from "../types";
import { authService } from "../services/api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  registerError: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
    name: string,
    surname: string
  ) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
  resetLoginError: () => void;
  resetRegisterError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginError: null,
  registerError: null,

  resetLoginError: () => set({ loginError: null }),
  resetRegisterError: () => set({ registerError: null }),

  initialize: async () => {
    set({ isLoading: true });

    if (authService.isTokenValid()) {
      const user = authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      // Clear invalid tokens
      authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, loginError: null });

    try {
      const {
        token,
        username: authUsername,
        role,
      } = await authService.login({ username, password });

      const user = {
        username: authUsername,
        role,
      };

      // Save token and user to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false, loginError: null });
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials and try again.";

      set({ isLoading: false, loginError: errorMessage });
      return false;
    }
  },

  register: async (username, email, password, name, surname) => {
    set({ isLoading: true, registerError: null });

    try {
      await authService.register({
        username,
        email,
        password,
        name,
        surname,
      });

      set({ isLoading: false, registerError: null });
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";

      set({ isLoading: false, registerError: errorMessage });
      return false;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
