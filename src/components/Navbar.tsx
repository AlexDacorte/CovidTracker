import { Link, useNavigate } from "react-router-dom";
import { Activity, Search } from "lucide-react";
import { useState } from "react";
import { useAllCountries } from "@/hooks/useCovidData";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { data: countries } = useAllCountries();
  const navigate = useNavigate();

  const filtered = countries?.filter((c) =>
    c.country.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleSelect = (country: string) => {
    navigate(`/country/${encodeURIComponent(country)}`);
    setQuery("");
    setOpen(false);
  };

  return (
    <nav className="glass-strong sticky top-0 z-50 border-b border-border/40">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Activity className="h-6 w-6 text-secondary" />
          <span className="text-lg font-bold tracking-tight font-['Space_Grotesk']">
            COVID-19 Tracker
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/countries" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Countries
          </Link>
          <Link to="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Compare
          </Link>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search country..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => query && setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 200)}
                className="w-48 pl-9 h-9 bg-muted/50 border-border/50 text-sm"
              />
            </div>
            {open && filtered && filtered.length > 0 && (
              <div className="absolute top-full mt-1 right-0 w-64 glass-strong rounded-lg overflow-hidden shadow-xl z-50">
                {filtered.map((c) => (
                  <button
                    key={c.country}
                    onMouseDown={() => handleSelect(c.country)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-muted/50 transition-colors"
                  >
                    <img src={c.countryInfo.flag} alt="" className="w-6 h-4 rounded-sm object-cover" />
                    <span>{c.country}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {(c.cases / 1e6).toFixed(1)}M
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
