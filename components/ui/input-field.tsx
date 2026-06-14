"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

export default function InputField({
  label,
  icon,
  error,
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="font-JakartaMedium text-sm text-secondary-900">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-general-200">
            {icon}
          </div>
        )}
        <input
          className={`w-full font-Jakarta rounded-full border border-general-100 bg-white px-4 py-3 text-secondary-900 placeholder:text-general-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${icon ? "pl-12" : ""} ${error ? "border-danger-500" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="font-Jakarta text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
}
