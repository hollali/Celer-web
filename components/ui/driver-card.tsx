"use client";

import Image from "next/image";
import { Star, Users } from "lucide-react";
import type { MarkerData } from "@/types/type";
import { formatTime } from "@/lib/utils";

interface DriverCardProps {
  item: MarkerData;
  selected: boolean;
  onSelect: () => void;
}

export default function DriverCard({ item, selected, onSelect }: DriverCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
        selected
          ? "border-primary-500 bg-general-600"
          : "border-general-100 bg-white hover:border-general-300"
      }`}
    >
      <Image
        src={item.profile_image_url || "/placeholder-driver.svg"}
        alt={`${item.first_name} ${item.last_name}`}
        width={64}
        height={64}
        className="rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-JakartaSemiBold text-secondary-900 truncate">
          {item.first_name} {item.last_name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-JakartaMedium text-sm text-secondary-500">
              {item.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-secondary-500" />
            <span className="font-Jakarta text-sm text-secondary-500">
              {item.car_seats} seats
            </span>
          </div>
        </div>
        {item.time && (
          <p className="font-Jakarta text-sm text-general-200 mt-1">
            {formatTime(item.time)} away
          </p>
        )}
      </div>
      {item.price && (
        <div className="text-right">
          <p className="font-JakartaBold text-lg text-primary-500">
            GH₵ {item.price}
          </p>
        </div>
      )}
    </button>
  );
}
