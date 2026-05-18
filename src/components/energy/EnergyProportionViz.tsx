"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { buildEnergyProportions, type ProportionSegment } from "@/lib/energy/energyProportionMockData";
import { demoDashboardTheme as dash } from "@/lib/energy/dashboardTheme";
import { formatRinggit } from "@/lib/energy/mockData";
import type { PlantMock } from "@/lib/energy/mockData";
import { cn } from "@/lib/utils";

type EnergyProportionVizProps = {
  plant: PlantMock;
  title: string;
  touTitle: string;
  costTitle: string;
  categoryTitle: string;
  loadFactorTitle: string;
  mdTitle: string;
  peakLabel: string;
  offPeakLabel: string;
  energyLabel: string;
  demandLabel: string;
  loadFactorCaption: string;
  peakShareSub: string;
  energyShareSub: string;
  categoryByLoadSub: string;
  categoryProdLabel: string;
  categoryHvacLabel: string;
  categoryLightLabel: string;
  categoryOtherLabel: string;
  footerNote: string;
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlice(
  cx: number,
  cy: number,
  r: number,
  ri: number,
  start: number,
  end: number
): string {
  if (end - start >= 359.99) end = start + 359.99;
  const o1 = polar(cx, cy, r, end);
  const o2 = polar(cx, cy, r, start);
  const i1 = polar(cx, cy, ri, end);
  const i2 = polar(cx, cy, ri, start);
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${r} ${r} 0 ${large} 0 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${ri} ${ri} 0 ${large} 1 ${i1.x} ${i1.y}`,
    "Z",
  ].join(" ");
}

function DonutChart({
  segments,
  center,
  sub,
  animate,
}: {
  segments: ProportionSegment[];
  center: string;
  sub?: string;
  animate: boolean;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const cx = 50;
  const cy = 50;
  const r = 38;
  const ri = 24;
  const slices = segments.reduce<
    Array<{ seg: ProportionSegment; d: string; endAngle: number; pct: number }>
  >((acc, seg) => {
    const start = acc.length > 0 ? acc[acc.length - 1].endAngle : 0;
    const sweep = (seg.value / total) * 360;
    const end = start + sweep;
    acc.push({
      seg,
      d: donutSlice(cx, cy, r, ri, start, end),
      endAngle: end,
      pct: (seg.value / total) * 100,
    });
    return acc;
  }, []);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="h-36 w-36 sm:h-40 sm:w-40" role="img">
        {slices.map(({ seg, d }, i) => (
          <motion.path
            key={seg.id}
            d={d}
            fill={seg.color}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={animate ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        <text x={cx} y={sub ? 47 : 50} textAnchor="middle" className="fill-slate-900 text-[9px] font-bold">
          {center}
        </text>
        {sub ? (
          <text x={cx} y={58} textAnchor="middle" className="fill-slate-500 text-[6px]">
            {sub}
          </text>
        ) : null}
      </svg>
      <ul className="mt-2 w-full space-y-1 text-[10px]">
        {slices.map(({ seg, pct }) => (
          <li key={seg.id} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: seg.color }} />
              {seg.label}
            </span>
            <span className="font-medium tabular-nums text-slate-800">{pct.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpeedometerGauge({
  value,
  max,
  label,
  caption,
  zones,
  animate,
  formatValue,
}: {
  value: number;
  max: number;
  label: string;
  caption: string;
  zones: { limit: number; color: string }[];
  animate: boolean;
  formatValue: (v: number) => string;
}) {
  const pct = Math.min(1, Math.max(0, value / max));
  const startDeg = -120;
  const endDeg = 120;
  const needleDeg = startDeg + pct * (endDeg - startDeg);
  const cx = 100;
  const cy = 95;
  const r = 72;

  const arcPath = (from: number, to: number, radius: number) => {
    const s = polar(cx, cy, radius, from);
    const e = polar(cx, cy, radius, to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const needleEnd = polar(cx, cy, r - 12, needleDeg);

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-center text-[11px] font-semibold text-slate-800">{label}</p>
      <svg viewBox="0 0 200 115" className="h-28 w-full max-w-[220px]" role="img" aria-label={caption}>
        <path
          d={arcPath(startDeg, endDeg, r)}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {zones.map((z, i) => {
          const prev = i === 0 ? 0 : zones[i - 1].limit;
          const from = startDeg + (prev / max) * (endDeg - startDeg);
          const to = startDeg + (z.limit / max) * (endDeg - startDeg);
          return (
            <motion.path
              key={z.limit}
              d={arcPath(from, to, r)}
              fill="none"
              stroke={z.color}
              strokeWidth="14"
              strokeLinecap="butt"
              initial={{ pathLength: 0 }}
              animate={animate ? { pathLength: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * i }}
            />
          );
        })}
        <motion.line
          x1={cx}
          y1={cy}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.35 }}
        />
        <circle cx={cx} cy={cy} r="5" fill="#0f172a" />
        <text x={cx} y={cy + 22} textAnchor="middle" className="fill-slate-900 text-[13px] font-bold">
          {formatValue(value)}
        </text>
      </svg>
      <p className="mt-1 text-center text-[10px] text-slate-500">{caption}</p>
    </div>
  );
}

export function EnergyProportionViz({
  plant,
  title,
  touTitle,
  costTitle,
  categoryTitle,
  loadFactorTitle,
  mdTitle,
  peakLabel,
  offPeakLabel,
  energyLabel,
  demandLabel,
  loadFactorCaption,
  peakShareSub,
  energyShareSub,
  categoryByLoadSub,
  categoryProdLabel,
  categoryHvacLabel,
  categoryLightLabel,
  categoryOtherLabel,
  footerNote,
}: EnergyProportionVizProps) {
  const t = useTranslations("energy");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, [plant.id]);

  const data = useMemo(() => buildEnergyProportions(plant, tick), [plant, tick]);
  const chartKey = `${plant.id}-${tick}`;
  const mdCaption = t("energyMixMdCaption", {
    billed: data.mdUtilization.billedKw,
    declared: data.mdUtilization.declaredKw,
  });

  const touSegments = data.timeOfUse.segments.map((s) => ({
    ...s,
    label: s.id === "peak" ? peakLabel : offPeakLabel,
  }));
  const costSegments = data.costMix.segments.map((s) => ({
    ...s,
    label: s.id === "energy" ? energyLabel : demandLabel,
  }));
  const categoryLabels: Record<string, string> = {
    prod: categoryProdLabel,
    hvac: categoryHvacLabel,
    light: categoryLightLabel,
    other: categoryOtherLabel,
  };
  const categorySegments = data.byCategory.segments.map((s) => ({
    ...s,
    label: categoryLabels[s.id] ?? s.label,
  }));

  return (
    <div className={cn("rounded-lg p-4", dash.card)}>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.06] sm:p-5">
        <h3 className="text-center text-base font-bold text-slate-900 sm:text-lg">{title}</h3>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 text-center text-[11px] font-semibold text-slate-700">{touTitle}</p>
            <DonutChart
              key={`tou-${chartKey}`}
              segments={touSegments}
              center={`${data.timeOfUse.peakShare}%`}
              sub={peakShareSub}
              animate
            />
            <p className="mt-2 text-center text-[10px] tabular-nums text-slate-500">
              {peakLabel}: {data.timeOfUse.peakKwh.toLocaleString("en-MY")} kWh · {offPeakLabel}:{" "}
              {data.timeOfUse.offPeakKwh.toLocaleString("en-MY")} kWh
            </p>
          </div>
          <div>
            <p className="mb-3 text-center text-[11px] font-semibold text-slate-700">{costTitle}</p>
            <DonutChart
              key={`cost-${chartKey}`}
              segments={costSegments}
              center={`${data.costMix.energyShare}%`}
              sub={energyShareSub}
              animate
            />
            <p className="mt-2 text-center text-[10px] tabular-nums text-slate-500">
              {energyLabel}: {formatRinggit(data.costMix.energyRm)} · {demandLabel}:{" "}
              {formatRinggit(data.costMix.demandRm)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 border-t border-slate-100 pt-8 md:grid-cols-2">
          <SpeedometerGauge
            key={`lf-${chartKey}`}
            label={loadFactorTitle}
            value={data.loadFactor.pct}
            max={100}
            caption={loadFactorCaption}
            zones={[
              { limit: 45, color: "#f87171" },
              { limit: 70, color: "#fbbf24" },
              { limit: 100, color: "#34d399" },
            ]}
            animate
            formatValue={(v) => `${(v / 100).toFixed(2)}`}
          />
          <SpeedometerGauge
            key={`md-${chartKey}`}
            label={mdTitle}
            value={data.mdUtilization.pct}
            max={100}
            caption={mdCaption}
            zones={[
              { limit: 60, color: "#34d399" },
              { limit: 85, color: "#fbbf24" },
              { limit: 100, color: "#f87171" },
            ]}
            animate
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
        </div>

        <div className="mt-8 border-t border-slate-100 pt-8">
          <p className="mb-4 text-center text-[11px] font-semibold text-slate-700">{categoryTitle}</p>
          <div className="mx-auto max-w-md">
            <DonutChart
              key={`cat-${chartKey}`}
              segments={categorySegments}
              center="100%"
              sub={categoryByLoadSub}
              animate
            />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">{footerNote}</p>
      </div>
    </div>
  );
}
