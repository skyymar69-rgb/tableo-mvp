"use client";

import { useQuery } from "@tanstack/react-query";

export function useRestaurant() {
  return useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const res = await fetch("/api/restaurant");
      if (!res.ok) return null;
      const data = await res.json();
      return data.restaurants?.[0] ?? null;
    },
    staleTime: 300_000,
  });
}
