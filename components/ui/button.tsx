"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const variants = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
  outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-100",
  danger: "bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800",
  success: "bg-success-500 text-white hover:bg-success-600 active:bg-success-700",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-JakartaSemiBold rounded-full flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}
