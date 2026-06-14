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
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-general-500">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-general-100 shrink-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 border-b border-general-100 flex items-center justify-between">
          {!collapsed && (
            <Link href="/home" className="flex items-center justify-center">
              <Image
                src="/celer-favicon.png"
                alt="Celer"
                width={36}
                height={36}
                className="rounded shrink-0"
              />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-general-500 text-secondary-500 hover:text-secondary-900 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center justify-center gap-3 rounded-xl px-2 py-3 font-JakartaSemiBold text-sm transition-colors ${
                  collapsed ? "lg:justify-center" : "lg:justify-start"
                } ${
                  isActive
                    ? "bg-primary-100 text-primary-500"
                    : "text-secondary-500 hover:bg-general-500 hover:text-secondary-900"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{tab.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-general-100">
          {userId && (
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <UserButton afterSignOutUrl="/sign-in" />
              {!collapsed && (
                <span className="font-Jakarta text-sm text-secondary-900 truncate">
                  Account
                </span>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-4 py-3 border-b border-general-100">
        <Link href="/home" className="flex items-center gap-2 font-JakartaExtraBold text-xl text-primary-500">
          <Image src="/celer-favicon.png" alt="Celer" width={22} height={22} className="rounded" />
          Celer
        </Link>
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
