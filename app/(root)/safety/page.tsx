"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Phone, Users, AlertTriangle, ChevronRight } from "lucide-react";

const safetyItems = [
  {
    icon: Phone,
    title: "Emergency SOS",
    description: "Quick access to emergency services",
    color: "text-danger-600 bg-danger-100",
  },
  {
    icon: Users,
    title: "Trusted Contacts",
    description: "Share your ride with family and friends",
    color: "text-primary-500 bg-primary-100",
  },
  {
    icon: Shield,
    title: "Driver Verification",
    description: "All drivers are verified and vetted",
    color: "text-success-500 bg-success-100",
  },
  {
    icon: AlertTriangle,
    title: "Safety Alerts",
    description: "Real-time safety notifications",
    color: "text-warning-500 bg-warning-100",
  },
];

export default function SafetyPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-general-500 rounded-full">
          <ArrowLeft className="h-6 w-6 text-secondary-900" />
        </button>
        <h1 className="font-JakartaBold text-2xl text-secondary-900">Safety</h1>
      </div>

      <div className="space-y-1">
        {safetyItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              className="flex w-full items-center gap-4 rounded-xl p-4 hover:bg-white transition-colors"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-JakartaSemiBold text-secondary-900">{item.title}</h3>
                <p className="font-Jakarta text-sm text-secondary-500">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-general-200" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
