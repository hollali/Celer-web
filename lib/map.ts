import type { Driver, MarkerData } from "@/types/type";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

export function calculateRegion(
  userLatitude: number,
  userLongitude: number,
  destinationLatitude?: number,
  destinationLongitude?: number
) {
  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  return {
    latitude: (userLatitude + destinationLatitude) / 2,
    longitude: (userLongitude + destinationLongitude) / 2,
    latitudeDelta: (maxLat - minLat) * 1.4,
    longitudeDelta: (maxLng - minLng) * 1.4,
  };
}

export function generateMarkersFromData({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.02;
    const lngOffset = (Math.random() - 0.5) * 0.02;

    return {
      ...driver,
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
    };
  });
}

export async function calculateDriverTimes({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number;
  userLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}): Promise<MarkerData[]> {
  if (!GOOGLE_API_KEY) return markers;

  try {
    const origins = `${userLatitude},${userLongitude}`;
    const destinations = `${destinationLatitude},${destinationLongitude}`;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();
    if (data.status !== "OK") return markers;

    const element = data.rows[0]?.elements[0];
    if (element?.status !== "OK") return markers;

    const duration = element.duration.value;
    const baseFare = 5;
    const farePerSecond = 0.005;
    const price = (baseFare + farePerSecond * duration).toFixed(2);

    return markers.map((marker) => ({
      ...marker,
      time: duration,
      price,
    }));
  } catch {
    return markers;
  }
}

export async function getDirections(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
) {
  if (!GOOGLE_API_KEY) return null;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();
    if (data.status !== "OK") return null;

    return data.routes[0]?.overview_polyline?.points || null;
  } catch {
    return null;
  }
}
