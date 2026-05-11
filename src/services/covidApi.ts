const BASE_URL = "https://disease.sh/v3/covid-19";

export interface GlobalStats {
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  population: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  updated: number;
}

export interface CountryStats {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  population: number;
  updated: number;
}

export interface HistoricalData {
  cases: Record<string, number>;
  deaths: Record<string, number>;
  recovered: Record<string, number>;
}

export interface HistoricalCountry {
  country: string;
  province: string[];
  timeline: HistoricalData;
}

export async function fetchGlobalStats(): Promise<GlobalStats> {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error("Failed to fetch global stats");
  return res.json();
}

export async function fetchAllCountries(): Promise<CountryStats[]> {
  const res = await fetch(`${BASE_URL}/countries?sort=cases`);
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export async function fetchCountryStats(country: string): Promise<CountryStats> {
  const res = await fetch(`${BASE_URL}/countries/${encodeURIComponent(country)}`);
  if (!res.ok) throw new Error("Failed to fetch country stats");
  return res.json();
}

export async function fetchHistoricalGlobal(days: number | "all" = 30): Promise<HistoricalData> {
  const res = await fetch(`${BASE_URL}/historical/all?lastdays=${days}`);
  if (!res.ok) throw new Error("Failed to fetch historical data");
  return res.json();
}

export async function fetchHistoricalCountry(country: string, days = 30): Promise<HistoricalCountry> {
  const res = await fetch(`${BASE_URL}/historical/${encodeURIComponent(country)}?lastdays=${days}`);
  if (!res.ok) throw new Error("Failed to fetch country historical data");
  return res.json();
}
