import { useParams, Link } from "react-router-dom";
import { useCountryStats, useHistoricalCountry } from "@/hooks/useCovidData";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { GlassCard } from "@/components/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Activity, Skull, HeartPulse, ShieldAlert, Users } from "lucide-react";

export default function CountryDetail() {
  const { name } = useParams<{ name: string }>();
  const country = decodeURIComponent(name || "");
  const { data, isLoading } = useCountryStats(country);
  const { data: historical, isLoading: histLoading } = useHistoricalCountry(country, 60);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <GlassCard hover={false}>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton className="w-16 h-12 rounded bg-muted" />
            ) : (
              <img src={data?.countryInfo.flag} alt={data?.country} className="w-16 h-12 rounded object-cover shadow-lg" />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-48 bg-muted" /> : data?.country}
              </h1>
              {data && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Users className="h-3.5 w-3.5" />
                  Population: {data.population.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </GlassCard>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Cases"
            value={data?.cases}
            todayValue={data?.todayCases}
            icon={Activity}
            glowColor="stat-glow-blue"
            iconColor="bg-secondary/20 text-secondary"
            isLoading={isLoading}
          />
          <StatCard
            title="Deaths"
            value={data?.deaths}
            todayValue={data?.todayDeaths}
            icon={Skull}
            glowColor="stat-glow-red"
            iconColor="bg-destructive/20 text-destructive"
            isLoading={isLoading}
          />
          <StatCard
            title="Recovered"
            value={data?.recovered}
            todayValue={data?.todayRecovered}
            icon={HeartPulse}
            glowColor="stat-glow-green"
            iconColor="bg-success/20 text-success"
            isLoading={isLoading}
          />
          <StatCard
            title="Active Cases"
            value={data?.active}
            icon={ShieldAlert}
            glowColor="stat-glow-purple"
            iconColor="bg-primary/20 text-primary"
            isLoading={isLoading}
          />
        </section>

        <TrendChart
          data={historical?.timeline}
          isLoading={histLoading}
          title={`${country} Trend (Last 60 Days)`}
        />
      </main>
    </div>
  );
}
