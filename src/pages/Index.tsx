import { useGlobalStats, useAllCountries, useHistoricalGlobal } from "@/hooks/useCovidData";
import { StatCard } from "@/components/StatCard";
import { TrendChart } from "@/components/TrendChart";
import { WorldMap } from "@/components/WorldMap";
import { Navbar } from "@/components/Navbar";
import { Activity, Skull, HeartPulse, ShieldAlert } from "lucide-react";

const Index = () => {
  const { data: global, isLoading: globalLoading } = useGlobalStats();
  const { data: countries, isLoading: countriesLoading } = useAllCountries();
  const { data: historical, isLoading: histLoading } = useHistoricalGlobal("all");

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
            Global COVID-19 Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Live data from disease.sh • Updated {global ? new Date(global.updated).toLocaleString() : "..."}
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Cases"
            value={global?.cases}
            todayValue={global?.todayCases}
            icon={Activity}
            glowColor="stat-glow-blue"
            iconColor="bg-secondary/20 text-secondary"
            isLoading={globalLoading}
          />
          <StatCard
            title="Deaths"
            value={global?.deaths}
            todayValue={global?.todayDeaths}
            icon={Skull}
            glowColor="stat-glow-red"
            iconColor="bg-destructive/20 text-destructive"
            isLoading={globalLoading}
          />
          <StatCard
            title="Recovered"
            value={global?.recovered}
            todayValue={global?.todayRecovered}
            icon={HeartPulse}
            glowColor="stat-glow-green"
            iconColor="bg-success/20 text-success"
            isLoading={globalLoading}
          />
          <StatCard
            title="Active Cases"
            value={global?.active}
            icon={ShieldAlert}
            glowColor="stat-glow-purple"
            iconColor="bg-primary/20 text-primary"
            isLoading={globalLoading}
          />
        </section>

        <TrendChart data={historical} isLoading={histLoading} title="Global Trend (Since Jan 2020)" />

        <WorldMap countries={countries} isLoading={countriesLoading} />
      </main>
    </div>
  );
};

export default Index;
