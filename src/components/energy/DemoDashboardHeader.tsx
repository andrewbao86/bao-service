"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { demoDashboardTheme as theme } from "@/lib/energy/dashboardTheme";
import { cn } from "@/lib/utils";

type DemoDashboardHeaderProps = {
  portalName: string;
  subtitle: string;
  liveLabel: string;
  facilityLabel: string;
  plantId: string;
  plantOptions: { id: string; name: string }[];
  onPlantChange: (id: string) => void;
};

export function DemoDashboardHeader({
  portalName,
  subtitle,
  liveLabel,
  facilityLabel,
  plantId,
  plantOptions,
  onPlantChange,
}: DemoDashboardHeaderProps) {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat("en-MY", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: true,
    }).format(new Date())
  );

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-MY", {
        dateStyle: "medium",
        timeStyle: "short",
        hour12: true,
      }).format(new Date());
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className={cn("px-4 py-4 sm:px-6 sm:py-5", theme.header)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 ring-1 ring-teal-400/30">
            <Activity className="h-5 w-5 text-teal-300" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-200/80">
              {portalName}
            </p>
            <h2 className="text-lg font-semibold text-white sm:text-xl">{subtitle}</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                theme.accentBg
              )}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                    theme.live
                  )}
                />
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", theme.live)} />
              </span>
              {liveLabel}
            </span>
            <p className="text-[11px] text-slate-300/90">{time}</p>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[220px]">
            <label htmlFor="demo-facility" className="sr-only">
              {facilityLabel}
            </label>
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {facilityLabel}
            </span>
            <select
              id="demo-facility"
              value={plantId}
              onChange={(e) => onPlantChange(e.target.value)}
              className={cn("mt-1 block w-full px-3 py-2 text-sm", theme.select)}
            >
              {plantOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
