"use client";

import { useMemo } from "react";
import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from "@react-google-maps/api";
import { calculateRegion } from "@/lib/map";
import type { MarkerData } from "@/types/type";

interface MapProps {
  userLatitude: number;
  userLongitude: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
  drivers?: MarkerData[];
  selectedDriver?: number | null;
  polyline?: string | null;
}

const containerStyle = { width: "100%", height: "100%" };

export default function Map({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
  drivers = [],
  selectedDriver,
  polyline,
}: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
  });

  const region = useMemo(
    () => {
      const r = calculateRegion(userLatitude, userLongitude, destinationLatitude, destinationLongitude);
      return { lat: r.latitude, lng: r.longitude, latDelta: r.latitudeDelta, lngDelta: r.longitudeDelta };
    },
    [userLatitude, userLongitude, destinationLatitude, destinationLongitude]
  );

  const zoom = useMemo(() => region.latDelta < 0.02 ? 15 : 12, [region.latDelta]);

  const decodedPolyline = useMemo(() => {
    if (!polyline || !isLoaded) return null;
    try {
      const path = google.maps.geometry.encoding.decodePath(polyline);
      return path;
    } catch {
      return null;
    }
  }, [polyline, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-general-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: region.lat, lng: region.lng }}
      zoom={zoom}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      <MarkerF
        position={{ lat: userLatitude, lng: userLongitude }}
        icon={{
          url: "/user-marker.svg",
          scaledSize: isLoaded ? new google.maps.Size(36, 36) : undefined,
        }}
      />

      {destinationLatitude && destinationLongitude && (
        <MarkerF
          position={{ lat: destinationLatitude, lng: destinationLongitude }}
          icon={{
            url: "/destination-marker.svg",
            scaledSize: isLoaded ? new google.maps.Size(36, 36) : undefined,
          }}
        />
      )}

      {drivers.map((driver) => (
        <MarkerF
          key={driver.id}
          position={{ lat: driver.latitude, lng: driver.longitude }}
          icon={{
            url:
              selectedDriver === driver.id
                ? "/selected-marker.svg"
                : "/marker.svg",
            scaledSize: isLoaded ? new google.maps.Size(36, 36) : undefined,
          }}
        />
      ))}

      {decodedPolyline && (
        <PolylineF
          path={decodedPolyline}
          options={{
            strokeColor: "#0286FF",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      )}
    </GoogleMap>
  );
}
