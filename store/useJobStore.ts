"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JobFilters } from "@/types";

interface JobStore {
  filters: JobFilters;
  isDark: boolean;
  setFilter: (key: keyof JobFilters, value: string) => void;
  clearFilters: () => void;
  toggleTheme: () => void;
}

const defaultFilters: JobFilters = {
  search: "",
  category: "",
  type: "",
  location: "",
};

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      isDark: true,
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      clearFilters: () => set({ filters: defaultFilters }),
      toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next });

        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", next);
          localStorage.setItem("hireboard-theme", next ? "dark" : "light");
        }
      },
    }),
    {
      name: "hireboard-storage",
      partialize: (state) => ({ isDark: state.isDark }),
    },
  ),
);
