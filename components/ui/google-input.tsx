"use client";

import { useRef, useState, useEffect } from "react";
import { Search, Navigation } from "lucide-react";

interface GoogleInputProps {
  icon?: "search" | "navigation";
  placeholder?: string;
  onSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export default function GoogleInput({
  icon = "search",
  placeholder = "Search for a location...",
  onSelect,
}: GoogleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const autocompleteTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!query || query.length < 3) {
      setPredictions([]);
      return;
    }

    clearTimeout(autocompleteTimer.current);
    autocompleteTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
        );
        const data = await res.json();
        if (data.predictions) {
          setPredictions(data.predictions);
        }
      } catch {
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(autocompleteTimer.current);
  }, [query]);

  const handleSelect = async (placeId: string, description: string) => {
    setQuery(description);
    setPredictions([]);
    setFocused(false);

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );
      const data = await res.json();
      const location = data.result?.geometry?.location;

      if (location) {
        onSelect({
          latitude: location.lat,
          longitude: location.lng,
          address: description,
        });
      }
    } catch {
      // handle error silently
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 rounded-full border border-general-100 bg-white dark:bg-general-600 px-4 py-3 shadow-sm">
        {icon === "search" ? (
          <Search className="h-5 w-5 text-general-200" />
        ) : (
          <Navigation className="h-5 w-5 text-general-200" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="flex-1 font-Jakarta text-secondary-900 placeholder:text-general-200 outline-none bg-transparent"
        />
        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        )}
      </div>

      {focused && predictions.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-2xl border border-general-100 bg-white dark:bg-general-600 shadow-lg z-50 max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() =>
                handleSelect(prediction.place_id, prediction.description)
              }
              className="flex items-center gap-3 px-4 py-3 text-left hover:bg-general-500 dark:hover:bg-general-700 transition-colors w-full"
            >
              <Search className="h-4 w-4 text-general-200 shrink-0" />
              <span className="font-Jakarta text-sm text-secondary-900">
                {prediction.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
