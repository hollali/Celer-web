"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Clock,
  CreditCard,
  Gift,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Star,
  Award,
  Bell,
} from "lucide-react";

const menuItems = [
  { icon: Clock, label: "Ride History", href: "/ride-history" },
  { icon: CreditCard, label: "Payment Methods", href: "/payment" },
  { icon: Gift, label: "Promotions", href: "/promotions" },
  { icon: Shield, label: "Safety", href: "/safety" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
  { icon: FileText, label: "Legal", href: "/legal" },
];

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Profile header */}
      <div className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src={user?.imageUrl || "/placeholder-user.svg"}
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="font-JakartaBold text-xl text-secondary-900">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="font-Jakarta text-sm text-secondary-500">
          {user?.primaryEmailAddress?.emailAddress}
        </p>

        <button
          onClick={() => router.push("/edit-profile")}
          className="mt-3 font-JakartaSemiBold text-sm text-primary-500"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="rounded-2xl bg-white border border-general-100 p-4 text-center">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 mx-auto mb-1" />
          <p className="font-JakartaBold text-lg text-secondary-900">4.8</p>
          <p className="font-Jakarta text-xs text-secondary-500">Rating</p>
        </div>
        <div className="rounded-2xl bg-white border border-general-100 p-4 text-center">
          <Award className="h-6 w-6 text-primary-500 mx-auto mb-1" />
          <p className="font-JakartaBold text-lg text-secondary-900">12</p>
          <p className="font-Jakarta text-xs text-secondary-500">Rides</p>
        </div>
        <div className="rounded-2xl bg-white border border-general-100 p-4 text-center">
          <Bell className="h-6 w-6 text-general-400 mx-auto mb-1" />
          <p className="font-JakartaBold text-lg text-secondary-900">3</p>
          <p className="font-Jakarta text-xs text-secondary-500">Earned</p>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="flex w-full items-center gap-4 rounded-xl p-4 hover:bg-white transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-general-500">
                <Icon className="h-5 w-5 text-secondary-900" />
              </div>
              <span className="flex-1 text-left font-Jakarta text-sm text-secondary-900">
                {item.label}
              </span>
              <ChevronRight className="h-5 w-5 text-general-200" />
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4">
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="flex w-full items-center gap-4 rounded-xl p-4 hover:bg-white transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-100">
            <LogOut className="h-5 w-5 text-danger-600" />
          </div>
          <span className="font-Jakarta text-sm text-danger-600">Sign Out</span>
        </button>
      </div>

      <p className="mt-8 text-center font-Jakarta text-xs text-general-200">
        APP VERSION 1.0.0 &bull; CELER
      </p>
    </div>
  );
}
