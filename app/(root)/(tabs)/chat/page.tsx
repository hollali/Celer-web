"use client";

import { useState } from "react";
import { MessageSquare, Search, Phone, Star } from "lucide-react";
import Image from "next/image";

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Kwame Asante",
    lastMessage: "I'm on my way to your location",
    time: "2 min ago",
    unread: 1,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Ama Boateng",
    lastMessage: "Thank you for riding with Celer!",
    time: "1 hour ago",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Kofi Mensah",
    lastMessage: "Please rate your experience",
    time: "3 hours ago",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
];

export default function ChatPage() {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="font-JakartaBold text-2xl text-secondary-900 mb-6">
        Messages
      </h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-general-200" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-general-100 bg-white dark:bg-general-600 pl-10 pr-4 py-2.5 font-Jakarta text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div className="space-y-1">
        {filtered.map((conv) => (
          <div
            key={conv.id}
            className="flex items-center gap-4 rounded-xl p-3 hover:bg-white dark:hover:bg-general-600 transition-colors cursor-pointer"
          >
            <Image
              src={conv.avatar}
              alt={conv.name}
              width={52}
              height={52}
              className="rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-JakartaSemiBold text-secondary-900 truncate">
                  {conv.name}
                </h3>
                <span className="font-Jakarta text-xs text-general-200 shrink-0">
                  {conv.time}
                </span>
              </div>
              <p className="font-Jakarta text-sm text-secondary-500 truncate mt-0.5">
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread > 0 && (
              <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                <span className="font-JakartaBold text-[10px] text-white">
                  {conv.unread}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
