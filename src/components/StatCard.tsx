import { GlassCard } from "./GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value?: number;
  todayValue?: number;
  icon: LucideIcon;
  glowColor: string;
  iconColor: string;
  isLoading?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
}

export function StatCard({ title, value, todayValue, icon: Icon, glowColor, iconColor, isLoading }: StatCardProps) {
  return (
    <GlassCard glowColor={glowColor}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-muted" />
          ) : (
            <p className="text-3xl font-bold tracking-tight">{value !== undefined ? formatNumber(value) : "—"}</p>
          )}
          {!isLoading && todayValue !== undefined && todayValue > 0 && (
            <p className="text-xs text-muted-foreground">
              +{formatNumber(todayValue)} today
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </GlassCard>
  );
}
