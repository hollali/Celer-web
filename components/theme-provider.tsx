"use client";

import { useEffect, type ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem("celer-theme");
    const theme = stored === "light" || stored === "dark" ? stored : null;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}
