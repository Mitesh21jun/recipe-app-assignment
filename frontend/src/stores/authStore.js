import { create } from 'zustand';

// Auth store for managing authentication state
export const useAuthStore = create((set) => ({
  user: null, // { id, username, ... }
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
}));
