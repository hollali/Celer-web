"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, ToggleLeft, ToggleRight, ChevronRight } from "lucide-react";
import { useState } from "react";

const legalItems = [
  { title: "Terms of Service", description: "Terms and conditions for using Celer" },
  { title: "Privacy Policy", description: "How we handle your data" },
  { title: "Cookie Policy", description: "How we use cookies" },
  { title: "Data Processing", description: "How we process your information" },
];

const toggles = [
  { label: "Share ride data for safety", defaultOn: true },
  { label: "Personalized offers", defaultOn: false },
  { label: "Usage analytics", defaultOn: true },
];

export default function LegalPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(toggles.map((t) => t.defaultOn));

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-general-500 rounded-full">
          <ArrowLeft className="h-6 w-6 text-secondary-900" />
        </button>
        <h1 className="font-JakartaBold text-2xl text-secondary-900">Legal & Privacy</h1>
      </div>

      <h2 className="font-JakartaSemiBold text-sm text-secondary-500 mb-3">Policies</h2>
      <div className="space-y-1 mb-8">
        {legalItems.map((item) => (
          <button
            key={item.title}
            className="flex w-full items-center gap-4 rounded-xl p-4 hover:bg-white transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-general-500">
              <FileText className="h-5 w-5 text-secondary-900" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-JakartaSemiBold text-sm text-secondary-900">{item.title}</h3>
              <p className="font-Jakarta text-xs text-secondary-500">{item.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-general-200" />
          </button>
        ))}
      </div>

      <h2 className="font-JakartaSemiBold text-sm text-secondary-500 mb-3">Privacy Settings</h2>
      <div className="space-y-2">
        {toggles.map((toggle, idx) => (
          <div
            key={toggle.label}
            className="flex items-center justify-between rounded-2xl bg-white border border-general-100 p-4"
          >
            <span className="font-Jakarta text-sm text-secondary-900">{toggle.label}</span>
            <button onClick={() => setSettings((prev) => prev.map((v, i) => (i === idx ? !v : v)))}>
              {settings[idx] ? (
                <ToggleRight className="h-6 w-6 text-primary-500" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-general-200" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
