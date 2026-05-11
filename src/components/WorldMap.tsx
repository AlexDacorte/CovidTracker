import { memo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "./GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import { CountryStats } from "@/services/covidApi";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  countries?: CountryStats[];
  isLoading?: boolean;
}

function getColor(deaths: number, cases: number): string {
  if (cases === 0) return "hsl(55, 70%, 55%)"; // yellow for zero deaths
  const rate = (deaths / cases) * 100;
  // rate typically 0–5%. Clamp to 0–5 for color mapping
  const t = Math.min(rate / 5, 1); // 0 = yellow, 1 = red
  const hue = 55 - t * 55; // 55 (yellow) → 0 (red)
  const sat = 70 + t * 20;  // 70% → 90%
  const light = 55 - t * 15; // 55% → 40%
  return `hsl(${hue.toFixed(0)}, ${sat.toFixed(0)}%, ${light.toFixed(0)}%)`;
}

export const WorldMap = memo(function WorldMap({ countries, isLoading }: WorldMapProps) {
  const navigate = useNavigate();

  // Build lookup by numeric ID (countryInfo._id matches geo.id in world-atlas)
  const countryByNumId = new Map<string, CountryStats>();
  const countryByIso3 = new Map<string, CountryStats>();
  countries?.forEach((c) => {
    if (c.countryInfo._id) countryByNumId.set(String(c.countryInfo._id), c);
    if (c.countryInfo.iso3) countryByIso3.set(c.countryInfo.iso3, c);
  });

  if (isLoading) {
    return (
      <GlassCard hover={false} className="col-span-full">
        <h3 className="text-lg font-semibold mb-4">Global Distribution</h3>
        <Skeleton className="h-80 w-full bg-muted" />
      </GlassCard>
    );
  }

  return (
    <GlassCard hover={false} className="col-span-full">
      <h3 className="text-lg font-semibold mb-4">Global Distribution</h3>
      <div className="w-full h-80 md:h-96">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [0, 30] }}
          className="w-full h-full"
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryData = countryByNumId.get(geo.id) || countryByIso3.get(geo.properties?.ISO_A3);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => {
                        if (countryData) navigate(`/country/${encodeURIComponent(countryData.country)}`);
                      }}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-content={
                        countryData
                          ? `${countryData.country}: ${((countryData.deaths / (countryData.cases || 1)) * 100).toFixed(2)}% death rate (${countryData.deaths.toLocaleString()} deaths / ${countryData.cases.toLocaleString()} cases)`
                          : geo.properties?.name || ""
                      }
                      style={{
                        default: {
                          fill: countryData ? getColor(countryData.deaths, countryData.cases) : "hsl(230, 12%, 22%)",
                          stroke: "hsl(230, 10%, 30%)",
                          strokeWidth: 0.5,
                          outline: "none",
                          cursor: countryData ? "pointer" : "default",
                        },
                        hover: {
                          fill: countryData ? "hsl(250, 80%, 65%)" : "hsl(230, 15%, 22%)",
                          stroke: "hsl(230, 15%, 35%)",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
        <span>Death Rate:</span>
        <div className="flex items-center gap-1">
          <span>Low</span>
          <div className="h-3 w-32 rounded-sm" style={{
            background: "linear-gradient(to right, hsl(55, 70%, 55%), hsl(30, 80%, 50%), hsl(0, 90%, 40%))"
          }} />
          <span>High</span>
        </div>
        <span className="ml-2 text-muted-foreground/50">■ No data</span>
      </div>
      <ReactTooltip id="map-tooltip" className="!glass-strong !text-xs !rounded-lg" />
    </GlassCard>
  );
});
