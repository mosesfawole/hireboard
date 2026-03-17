"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JobFilters } from "@/types";

interface JobStore {
  // ── Filter state ─────────────────────────────────────
  // What the user has typed/selected in the filter bar
  filters: JobFilters;

  // ── UI state ─────────────────────────────────────────
  // Which tab is active on the admin dashboard
  adminTab: "overview" | "jobs" | "companies";

  // Whether the mobile filter drawer is open
  filterDrawerOpen: boolean;

  // ── Theme ─────────────────────────────────────────────
  isDark: boolean;

  // ── Actions ───────────────────────────────────────────
  setFilter: (key: keyof JobFilters, value: string) => void;
  clearFilters: () => void;
  setAdminTab: (tab: JobStore["adminTab"]) => void;
  toggleFilterDrawer: () => void;
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
      adminTab: "overview",
      filterDrawerOpen: false,
      isDark: true,

      // Update a single filter field
      // e.g. setFilter("category", "Engineering")
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      // Reset all filters back to empty
      clearFilters: () => set({ filters: defaultFilters }),

      setAdminTab: (adminTab) => set({ adminTab }),

      toggleFilterDrawer: () =>
        set((state) => ({ filterDrawerOpen: !state.filterDrawerOpen })),

      // Toggle dark/light mode and save preference
      toggleTheme: () => {
        const next = !get().isDark;
        set({ isDark: next });
        // Apply to html element for Tailwind dark mode class
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", next);
          localStorage.setItem("hireboard-theme", next ? "dark" : "light");
        }
      },
    }),
    {
      name: "hireboard-storage",
      // Only persist theme — filters reset on every visit
      partialize: (s) => ({ isDark: s.isDark }),
    },
  ),
);
