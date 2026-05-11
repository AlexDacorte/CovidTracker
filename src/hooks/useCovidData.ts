import { useQuery } from "@tanstack/react-query";
import {
  fetchGlobalStats,
  fetchAllCountries,
  fetchCountryStats,
  fetchHistoricalGlobal,
  fetchHistoricalCountry,
} from "@/services/covidApi";

export function useGlobalStats() {
  return useQuery({
    queryKey: ["covid", "global"],
    queryFn: fetchGlobalStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllCountries() {
  return useQuery({
    queryKey: ["covid", "countries"],
    queryFn: fetchAllCountries,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCountryStats(country: string) {
  return useQuery({
    queryKey: ["covid", "country", country],
    queryFn: () => fetchCountryStats(country),
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  });
}

export function useHistoricalGlobal(days: number | "all" = 30) {
  return useQuery({
    queryKey: ["covid", "historical", "global", days],
    queryFn: () => fetchHistoricalGlobal(days),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHistoricalCountry(country: string, days = 30) {
  return useQuery({
    queryKey: ["covid", "historical", "country", country, days],
    queryFn: () => fetchHistoricalCountry(country, days),
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  });
}
