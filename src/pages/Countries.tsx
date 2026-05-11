import { useState, useMemo } from "react";
import { useAllCountries } from "@/hooks/useCovidData";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Search } from "lucide-react";

type SortKey = "cases" | "deaths" | "recovered" | "active" | "casesPerOneMillion" | "deathRate";
type SortDir = "asc" | "desc";

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

const Countries = () => {
  const { data: countries, isLoading } = useAllCountries();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("cases");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = useMemo(() => {
    if (!countries) return [];
    let list = countries.filter((c) =>
      c.country.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) => {
      let av: number, bv: number;
      if (sortKey === "deathRate") {
        av = a.cases > 0 ? a.deaths / a.cases : 0;
        bv = b.cases > 0 ? b.deaths / b.cases : 0;
      } else {
        av = a[sortKey];
        bv = b[sortKey];
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [countries, search, sortKey, sortDir]);

  const columns: { key: SortKey; label: string }[] = [
    { key: "cases", label: "Cases" },
    { key: "deaths", label: "Deaths" },
    { key: "recovered", label: "Recovered" },
    { key: "active", label: "Active" },
    { key: "deathRate", label: "Death Rate" },
    { key: "casesPerOneMillion", label: "Cases/1M" },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Countries</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-border/50 text-sm"
            />
          </div>
        </header>

        <GlassCard hover={false}>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-muted" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-12">#</TableHead>
                  <TableHead className="text-muted-foreground">Country</TableHead>
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className="text-muted-foreground cursor-pointer select-none text-right"
                      onClick={() => toggleSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown className={`h-3 w-3 ${sortKey === col.key ? "text-primary" : "text-muted-foreground/40"}`} />
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((c, i) => (
                  <TableRow
                    key={c.country}
                    className="border-border/20 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => navigate(`/country/${encodeURIComponent(c.country)}`)}
                  >
                    <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img src={c.countryInfo.flag} alt="" className="w-6 h-4 rounded-sm object-cover" />
                        <span className="font-medium">{c.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{fmt(c.cases)}</TableCell>
                    <TableCell className="text-right text-destructive">{fmt(c.deaths)}</TableCell>
                    <TableCell className="text-right text-success">{fmt(c.recovered)}</TableCell>
                    <TableCell className="text-right">{fmt(c.active)}</TableCell>
                    <TableCell className="text-right">
                      {c.cases > 0 ? ((c.deaths / c.cases) * 100).toFixed(2) + "%" : "—"}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{fmt(c.casesPerOneMillion)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </GlassCard>
      </main>
    </div>
  );
};

export default Countries;
