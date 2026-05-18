"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChartPoint {
  x: number;
  y: number;
}

interface EnergyChartProps {
  data: ChartPoint[];
  unit?: string;
  alternateColors?: boolean;
  variant?: "default" | "portal";
}

export function EnergyChart({
  data,
  unit = "kW",
  alternateColors,
  variant = "default",
}: EnergyChartProps) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.y), 1);
  const min = Math.min(...data.map((d) => d.y));
  const mean = data.reduce((s, d) => s + d.y, 0) / data.length;

  const primary = variant === "portal" ? "#2dd4bf" : "#3b82f6";
  const secondary = variant === "portal" ? "#64748b" : "#6b7280";
  const track = variant === "portal" ? "bg-[#121c32]" : "bg-slate-800";
  const statBg = variant === "portal" ? "bg-[#1a2640]" : "bg-slate-800";

  return (
    <ChartShell>
      <ChartBarRow
        data={data}
        max={max}
        alternateColors={alternateColors}
        primary={primary}
        secondary={secondary}
        track={track}
      />
      <ChartStats min={min} mean={mean} max={max} unit={unit} statBg={statBg} />
    </ChartShell>
  );
}

function ChartShell({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function ChartBarRow({
  data,
  max,
  alternateColors,
  primary,
  secondary,
  track,
}: {
  data: ChartPoint[];
  max: number;
  alternateColors?: boolean;
  primary: string;
  secondary: string;
  track: string;
}) {
  return (
    <div className={cn("h-32 rounded-lg p-4 relative overflow-hidden", track)}>
      <div className="flex items-end justify-between h-full gap-1">
        {data.map((point, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t min-h-[8px]"
            style={{
              backgroundColor: alternateColors ? (i % 2 === 0 ? primary : secondary) : primary,
            }}
            layout
            animate={{ height: `${Math.max(8, (point.y / max) * 100)}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

function ChartStats({
  min,
  mean,
  max,
  unit,
  statBg,
}: {
  min: number;
  mean: number;
  max: number;
  unit: string;
  statBg: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 text-xs">
      <ChartStat label="Min" value={`${min.toFixed(1)} ${unit}`} bg={statBg} />
      <ChartStat label="Mean" value={`${mean.toFixed(1)} ${unit}`} bg={statBg} />
      <ChartStat label="Max" value={`${max.toFixed(1)} ${unit}`} bg={statBg} />
    </div>
  );
}

function ChartStat({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div className={cn("rounded p-2", bg)}>
      <div className="text-slate-400">{label}</div>
      <div className="text-white font-medium">{value}</div>
    </div>
  );
}
