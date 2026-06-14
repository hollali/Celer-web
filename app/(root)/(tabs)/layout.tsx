"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import {
  Home,
  Clock,
  MessageSquare,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Rides", href: "/rides", icon: Clock },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Profile", href: "/profile", icon: User },
];

export default function TabsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-general-500">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-general-100 shrink-0">
        <div className="p-6 border-b border-general-100">
          <Link
            href="/home"
            className="font-JakartaExtraBold text-2xl text-primary-500"
          >
            Celer
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-JakartaSemiBold text-sm transition-colors ${
                  isActive
                    ? "bg-primary-100 text-primary-500"
                    : "text-secondary-500 hover:bg-general-500 hover:text-secondary-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-general-100">
          {userId && (
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/sign-in" />
              <span className="font-Jakarta text-sm text-secondary-900">
                Account
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-4 py-3 border-b border-general-100">
        <span className="font-JakartaExtraBold text-xl text-primary-500">
          Celer
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-secondary-900"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-general-100 flex justify-around py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 ${
                isActive ? "text-primary-500" : "text-secondary-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-Jakarta text-xs">{tab.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile overlay menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-14 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 font-JakartaSemiBold text-sm transition-colors ${
                      isActive
                        ? "bg-primary-100 text-primary-500"
                        : "text-secondary-500 hover:bg-general-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-general-100">
              {userId && (
                <div className="flex items-center gap-3 px-4">
<UserButton afterSignOutUrl="/sign-in" />
                  <span className="font-Jakarta text-sm text-secondary-900">
                    Account
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
