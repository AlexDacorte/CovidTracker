import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { useAllCountries, useCountryStats, useHistoricalCountry } from "@/hooks/useCovidData";
import { Activity, Skull, HeartPulse, ShieldAlert, Users, ArrowLeftRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function CountryPanel({ country }: { country: string }) {
  const { data, isLoading } = useCountryStats(country);
  const { data: historical, isLoading: histLoading } = useHistoricalCountry(country, 60);

  return (
    <div className="space-y-4 flex-1 min-w-0">
      <GlassCard hover={false}>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="w-12 h-8 rounded bg-muted" />
          ) : (
            <img src={data?.countryInfo.flag} alt={data?.country} className="w-12 h-8 rounded object-cover shadow-lg" />
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight truncate">
              {isLoading ? <Skeleton className="h-6 w-32 bg-muted" /> : data?.country}
            </h2>
            {data && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                {data.population.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <StatCard title="Cases" value={data?.cases} todayValue={data?.todayCases} icon={Activity} glowColor="stat-glow-blue" iconColor="bg-secondary/20 text-secondary" isLoading={isLoading} />
        <StatCard title="Deaths" value={data?.deaths} todayValue={data?.todayDeaths} icon={Skull} glowColor="stat-glow-red" iconColor="bg-destructive/20 text-destructive" isLoading={isLoading} />
        <StatCard title="Recovered" value={data?.recovered} todayValue={data?.todayRecovered} icon={HeartPulse} glowColor="stat-glow-green" iconColor="bg-success/20 text-success" isLoading={isLoading} />
        <StatCard title="Active" value={data?.active} icon={ShieldAlert} glowColor="stat-glow-purple" iconColor="bg-primary/20 text-primary" isLoading={isLoading} />
      </div>

      <TrendChart data={historical?.timeline} isLoading={histLoading} title={`${country} Trend (60 Days)`} />
    </div>
  );
}

export default function Compare() {
  const { data: countries, isLoading: countriesLoading } = useAllCountries();
  const [countryA, setCountryA] = useState("");
  const [countryB, setCountryB] = useState("");

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1 flex items-center gap-3">
            <ArrowLeftRight className="h-8 w-8 text-primary" />
            Compare Countries
          </h1>
          <p className="text-muted-foreground text-sm">Select two countries to compare their COVID-19 statistics side-by-side</p>
        </header>

        <GlassCard hover={false}>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Country A</label>
              <Select value={countryA} onValueChange={setCountryA}>
                <SelectTrigger className="bg-muted/50 border-border/50">
                  <SelectValue placeholder={countriesLoading ? "Loading..." : "Select country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((c) => (
                    <SelectItem key={c.country} value={c.country}>
                      <span className="flex items-center gap-2">
                        <img src={c.countryInfo.flag} alt="" className="w-5 h-3.5 rounded-sm object-cover inline" />
                        {c.country}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ArrowLeftRight className="h-5 w-5 text-muted-foreground shrink-0 mt-4 sm:mt-5" />

            <div className="flex-1 w-full">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Country B</label>
              <Select value={countryB} onValueChange={setCountryB}>
                <SelectTrigger className="bg-muted/50 border-border/50">
                  <SelectValue placeholder={countriesLoading ? "Loading..." : "Select country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((c) => (
                    <SelectItem key={c.country} value={c.country}>
                      <span className="flex items-center gap-2">
                        <img src={c.countryInfo.flag} alt="" className="w-5 h-3.5 rounded-sm object-cover inline" />
                        {c.country}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {countryA && countryB ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <CountryPanel country={countryA} />
            <CountryPanel country={countryB} />
          </div>
        ) : (
          <GlassCard hover={false} className="text-center py-16">
            <p className="text-muted-foreground">Select two countries above to start comparing</p>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
