import { create } from "zustand";

import { AuthUser } from "../types";
import { authService } from "../services/api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    name: string,
    surname: string
  ) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

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
    set({ isLoading: true, error: null });

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

      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({ isLoading: false, error: errorMessage });
    }
  },

  register: async (username, email, password, name, surname) => {
    set({ isLoading: true, error: null });

    try {
      await authService.register({
        username,
        email,
        password,
        name,
        surname,
      });

      set({ isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({ isLoading: false, error: errorMessage });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
