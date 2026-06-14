"use client";

import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const getSystemTheme = (): "light" | "dark" =>
  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const applyTheme = (resolved: "light" | "dark") => {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("celer-theme") as Theme) || "system";
};

const store = create<ThemeState>((set, get) => {
  const stored = getStoredTheme();
  const system = getSystemTheme();
  const resolved = stored === "system" ? system : stored;

  if (typeof window !== "undefined") {
    applyTheme(resolved);
  }

  return {
    theme: stored,
    resolved,
    setTheme: (theme: Theme) => {
      localStorage.setItem("celer-theme", theme);
      const system = getSystemTheme();
      const resolved = theme === "system" ? system : theme;
      applyTheme(resolved);
      set({ theme, resolved });
    },
  };
});

export const useThemeStore = store;
