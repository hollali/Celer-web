"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Clock, MapPin, CreditCard, Search, ArrowUpDown } from "lucide-react";
import { fetchAPI } from "@/lib/fetch";
import { sortRides, formatDate, formatCurrency } from "@/lib/utils";
import type { Ride } from "@/types/type";

const statusColors: Record<string, string> = {
  paid: "bg-success-100 text-success-600",
  pending: "bg-warning-100 text-warning-600",
};

export default function RidesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    (async () => {
      try {
        const data = await fetchAPI<{ data: Ride[] }>(
          `/api/ride?user_email=${user.primaryEmailAddress?.emailAddress}`
        );
        setRides(sortRides(data.data));
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filteredRides = rides.filter((ride) => {
    if (filter !== "all" && ride.payment_status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        ride.origin_address.toLowerCase().includes(q) ||
        ride.destination_address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-JakartaBold text-2xl text-secondary-900">My Rides</h1>
        <button
          onClick={() => router.push("/ride-history")}
          className="font-JakartaSemiBold text-sm text-primary-500"
        >
          View All
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-general-200" />
          <input
            type="text"
            placeholder="Search rides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-general-100 bg-white pl-10 pr-4 py-2.5 font-Jakarta text-sm outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "paid", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 font-JakartaSemiBold text-sm transition-colors ${
                filter === f
                  ? "bg-primary-500 text-white"
                  : "bg-white text-secondary-500 border border-general-100 hover:border-primary-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : filteredRides.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-general-200 mx-auto mb-4" />
          <p className="font-JakartaSemiBold text-secondary-900">No rides found</p>
          <p className="font-Jakarta text-sm text-secondary-500 mt-1">
            {rides.length === 0
              ? "Book your first ride to get started"
              : "Try a different filter or search"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRides.map((ride) => (
            <div
              key={ride.ride_id}
              className="rounded-2xl bg-white border border-general-100 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                    <p className="font-Jakarta text-sm text-secondary-900 line-clamp-1">
                      {ride.origin_address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-danger-500" />
                    </div>
                    <p className="font-Jakarta text-sm text-secondary-900 line-clamp-1">
                      {ride.destination_address}
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 font-JakartaSemiBold text-xs ${
                    statusColors[ride.payment_status] || "bg-general-100 text-general-200"
                  }`}
                >
                  {ride.payment_status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="font-Jakarta text-general-200">
                    {formatDate(ride.created_at)}
                  </span>
                  <span className="font-JakartaSemiBold text-secondary-900">
                    {formatCurrency(ride.fare_price)}
                  </span>
                </div>

                {ride.payment_status === "pending" && (
                  <button
                    onClick={() =>
                      router.push(
                        `/payment?ride_id=${ride.ride_id}&amount=${ride.fare_price}&email=${user?.primaryEmailAddress?.emailAddress}`
                      )
                    }
                    className="flex items-center gap-1 font-JakartaSemiBold text-primary-500 hover:text-primary-600"
                  >
                    <CreditCard className="h-4 w-4" />
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
