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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] md:flex-row overflow-hidden bg-general-500">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-general-600 border-r border-general-100 shrink-0 transition-all duration-300 ${
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
            className="p-1.5 rounded-lg hover:bg-general-500 dark:hover:bg-general-700 text-secondary-500 hover:text-secondary-900 transition-colors"
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
                    : "text-secondary-500 hover:bg-general-500 dark:hover:bg-general-700 hover:text-secondary-900"
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

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-general-600 border-t border-general-100 flex items-center justify-around px-2 pb-2 pt-1.5">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-xs font-JakartaSemiBold transition-colors ${
                isActive
                  ? "bg-primary-100 text-primary-500"
                  : "text-secondary-500 hover:text-secondary-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
