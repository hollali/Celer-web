"use client";

import { create } from "zustand";
import type { MarkerData } from "@/types/type";

interface LocationState {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  setUserLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

interface DriverState {
  drivers: MarkerData[];
  selectedDriver: number | null;
  setSelectedDriver: (id: number | null) => void;
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: (location) =>
    set({
      userLatitude: location.latitude,
      userLongitude: location.longitude,
      userAddress: location.address,
    }),
  setDestinationLocation: (location) =>
    set({
      destinationLatitude: location.latitude,
      destinationLongitude: location.longitude,
      destinationAddress: location.address,
    }),
}));

export const useDriverStore = create<DriverState>((set) => ({
  drivers: [],
  selectedDriver: null,
  setSelectedDriver: (id) => set({ selectedDriver: id }),
  setDrivers: (drivers) => set({ drivers }),
  clearSelectedDriver: () => set({ selectedDriver: null }),
}));
