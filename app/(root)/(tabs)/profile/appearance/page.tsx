"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, Moon, Monitor, Check } from "lucide-react";
import { useThemeStore } from "@/store/theme";

const options = [
  {
    value: "light" as const,
    label: "Light",
    description: "Bright and clean interface",
    icon: Sun,
  },
  {
    value: "dark" as const,
    label: "Dark",
    description: "Striking dark interface",
    icon: Moon,
  },
  {
    value: "system" as const,
    label: "System",
    description: "Follows your device setting",
    icon: Monitor,
  },
];

export default function AppearancePage() {
  const router = useRouter();
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-general-500 dark:hover:bg-general-700 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-secondary-900" />
        </button>
        <h1 className="font-JakartaBold text-2xl text-secondary-900">Appearance</h1>
      </div>

      <p className="font-Jakarta text-sm text-secondary-500 mb-6">
        Choose how Celer looks on your device
      </p>

      <div className="space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                isActive
                  ? "border-primary-500 bg-primary-100 dark:bg-primary-100/20"
                  : "border-general-100 bg-white dark:bg-general-600 dark:border-general-100 hover:border-general-300"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${
                  isActive
                    ? "bg-primary-500 text-white"
                    : "bg-general-500 dark:bg-general-700 text-secondary-900"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-JakartaSemiBold text-secondary-900">{option.label}</p>
                <p className="font-Jakarta text-sm text-secondary-500 mt-0.5">
                  {option.description}
                </p>
              </div>
              {isActive && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
