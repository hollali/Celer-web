import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Jakarta: ["Plus Jakarta Sans", "sans-serif"],
        JakartaLight: ["Plus Jakarta Sans", "sans-serif"],
        JakartaExtraLight: ["Plus Jakarta Sans", "sans-serif"],
        JakartaMedium: ["Plus Jakarta Sans", "sans-serif"],
        JakartaSemiBold: ["Plus Jakarta Sans", "sans-serif"],
        JakartaBold: ["Plus Jakarta Sans", "sans-serif"],
        JakartaExtraBold: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        primary: {
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        secondary: {
          500: "var(--secondary-500)",
          900: "var(--secondary-900)",
        },
        success: {
          100: "var(--success-100)",
          200: "var(--success-200)",
          300: "var(--success-300)",
          400: "var(--success-400)",
          500: "var(--success-500)",
          600: "var(--success-600)",
          700: "var(--success-700)",
          800: "var(--success-800)",
          900: "var(--success-900)",
        },
        danger: {
          100: "var(--danger-100)",
          200: "var(--danger-200)",
          300: "var(--danger-300)",
          400: "var(--danger-400)",
          500: "var(--danger-500)",
          600: "var(--danger-600)",
          700: "var(--danger-700)",
          800: "var(--danger-800)",
          900: "var(--danger-900)",
        },
        warning: {
          100: "var(--warning-100)",
          200: "var(--warning-200)",
          300: "var(--warning-300)",
          400: "var(--warning-400)",
          500: "var(--warning-500)",
          600: "var(--warning-600)",
          700: "var(--warning-700)",
          800: "var(--warning-800)",
          900: "var(--warning-900)",
        },
        general: {
          100: "var(--general-100)",
          200: "var(--general-200)",
          300: "var(--general-300)",
          400: "var(--general-400)",
          500: "var(--general-500)",
          600: "var(--general-600)",
          700: "var(--general-700)",
          800: "var(--general-800)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
