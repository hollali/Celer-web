"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Navigation, MapPin, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Map from "@/components/ui/map";
import GoogleInput from "@/components/ui/google-input";
import DriverCard from "@/components/ui/driver-card";
import Button from "@/components/ui/button";
import { useLocationStore, useDriverStore } from "@/store";
import { fetchAPI } from "@/lib/fetch";
import {
  generateMarkersFromData,
  calculateDriverTimes,
  getDirections,
} from "@/lib/map";
import type { Driver, MarkerData, Ride } from "@/types/type";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const {
    userLatitude,
    userLongitude,
    userAddress,
    destinationLatitude,
    destinationLongitude,
    destinationAddress,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();

  const {
    drivers,
    selectedDriver,
    setDrivers,
    setSelectedDriver,
  } = useDriverStore();

  const [booking, setBooking] = useState(false);
  const [rideTime, setRideTime] = useState<number | null>(null);
  const [farePrice, setFarePrice] = useState<string | null>(null);
  const [polyline, setPolyline] = useState<string | null>(null);
  const [showDriverPanel, setShowDriverPanel] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: "Current Location",
        });
      },
      () => {
        setUserLocation({
          latitude: 5.6037,
          longitude: -0.187,
          address: "Accra, Ghana",
        });
      }
    );
  }, [setUserLocation]);

  useEffect(() => {
    if (!userLatitude || !userLongitude) return;

    (async () => {
      try {
        const data = await fetchAPI<{ data: Driver[] }>("/api/driver");
        const markers = generateMarkersFromData({
          data: data.data,
          userLatitude,
          userLongitude,
        });
        setDrivers(markers);
      } catch {
        // handle error silently
      }
    })();
  }, [userLatitude, userLongitude, setDrivers]);

  useEffect(() => {
    if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) return;

    (async () => {
      const updatedMarkers = await calculateDriverTimes({
        markers: drivers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      });
      setDrivers(updatedMarkers);

      const route = await getDirections(
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude
      );
      setPolyline(route);

      const firstDriver = updatedMarkers[0];
      if (firstDriver) {
        setRideTime(firstDriver.time || null);
        setFarePrice(firstDriver.price || null);
        setShowDriverPanel(true);
      }
    })();
  }, [destinationLatitude, destinationLongitude]);

  const handleBookRide = async () => {
    if (!selectedDriver || !userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) return;

    setBooking(true);

    try {
      const selected = drivers.find((d) => d.id === selectedDriver);
      await fetchAPI<{ data: Ride }>("/api/ride", {
        method: "POST",
        body: JSON.stringify({
          origin_address: userAddress,
          destination_address: destinationAddress,
          origin_latitude: userLatitude,
          origin_longitude: userLongitude,
          destination_latitude: destinationLatitude,
          destination_longitude: destinationLongitude,
          ride_time: rideTime?.toString() || "0",
          fare_price: farePrice ? parseFloat(farePrice) : 10,
          payment_status: "pending",
          driver_id: selectedDriver,
          user_id: user?.id || "",
        }),
      });

      router.push("/rides");
    } catch {
      // handle error
    } finally {
      setBooking(false);
    }
  };

  if (!userLatitude || !userLongitude) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col lg:flex-row">
      {/* Map area */}
      <div className="relative flex-1 min-h-[300px] lg:min-h-0">
        <Map
          userLatitude={userLatitude}
          userLongitude={userLongitude}
          destinationLatitude={destinationLatitude || undefined}
          destinationLongitude={destinationLongitude || undefined}
          drivers={drivers}
          selectedDriver={selectedDriver}
          polyline={polyline}
        />

        {/* Search overlays */}
        <div className="absolute top-4 left-4 right-14 z-10 space-y-2 max-w-md">
          <GoogleInput
            icon="navigation"
            placeholder="Where are you going?"
            onSelect={(loc) => {
              setDestinationLocation(loc);
          }}
        />
        </div>

        {/* User avatar */}
        <Link
          href="/profile"
          className="absolute top-4 right-3 z-20 w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-general-100 shadow-md hover:opacity-80 transition-opacity bg-white dark:bg-general-600"
        >
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="Profile"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
              <span className="font-JakartaBold text-primary-500 text-sm">
                {user?.firstName?.charAt(0) || "?"}
              </span>
            </div>
          )}
        </Link>

        {userLatitude && userLongitude && (
          <div className="absolute bottom-4 left-4 z-10">
            <button
              onClick={() => {
                navigator.geolocation.getCurrentPosition((pos) => {
                  setUserLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    address: "Current Location",
                  });
                });
              }}
              className="flex items-center gap-2 rounded-full bg-white dark:bg-general-600 px-4 py-2 shadow-md text-sm font-JakartaSemiBold text-primary-500"
            >
              <Navigation className="h-4 w-4" />
              My Location
            </button>
          </div>
        )}
      </div>

      {/* Driver selection panel */}
      {showDriverPanel && (
        <div className="bg-white dark:bg-general-600 border-t lg:border-t-0 lg:border-l border-general-100 w-full lg:w-96 overflow-y-auto">
          <div className="p-4 border-b border-general-100">
            <h2 className="font-JakartaBold text-lg text-secondary-900">
              Select a Driver
            </h2>
            <p className="font-Jakarta text-sm text-secondary-500">
              {destinationAddress}
            </p>
          </div>

          <div className="p-4 space-y-3">
            {drivers.map((driver) => (
              <DriverCard
                key={driver.id}
                item={driver}
                selected={selectedDriver === driver.id}
                onSelect={() => setSelectedDriver(driver.id)}
              />
            ))}
          </div>

          <div className="p-4 border-t border-general-100">
            <Button
              onClick={handleBookRide}
              loading={booking}
              disabled={!selectedDriver}
              className="w-full"
              size="lg"
            >
              {selectedDriver
                ? `Book Ride${farePrice ? ` - GH₵ ${farePrice}` : ""}`
                : "Select a Driver"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
