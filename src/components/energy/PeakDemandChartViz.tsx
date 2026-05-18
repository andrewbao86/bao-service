"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { demoDashboardTheme as dash } from "@/lib/energy/dashboardTheme";
import {
  buildPeakPeriodSeries,
  peakPeriodHourLabel,
  peakPeriodTickHours,
  PEAK_PERIOD_END_HOUR,
  PEAK_PERIOD_START_HOUR,
} from "@/lib/energy/peakPeriodMockData";
import type { PlantMock } from "@/lib/energy/mockData";
import { cn } from "@/lib/utils";

const CHART = { w: 720, h: 260, pad: { l: 58, r: 20, t: 24, b: 40 } };

type PeakDemandChartVizProps = {
  plant: PlantMock;
  title: string;
  legendMd: string;
  legendPower: string;
  statMinLabel: string;
  statMaxLabel: string;
  statMeanLabel: string;
  peakPeriodLabel: string;
  refMaxLabel: (value: string) => string;
  refMinLabel: (value: string) => string;
  refTargetLabel: (value: string) => string;
  timeStartLabel: string;
  timeEndLabel: string;
  yAxisUnit: string;
};

function formatKw(n: number): string {
  return `${n.toLocaleString("en-MY", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kW`;
}

function yScale(value: number, min: number, max: number, innerH: number, padT: number): number {
  const range = max - min || 1;
  return padT + innerH - ((value - min) / range) * innerH;
}

function xScale(t: number, innerW: number, padL: number): number {
  return padL + t * innerW;
}

function jaggedPath(coords: { x: number; y: number }[]): string {
  if (!coords.length) return "";
  return coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(" ");
}

function mdStepPath(
  steps: { t0: number; t1: number; mdKw: number }[],
  yMin: number,
  yMax: number,
  innerW: number,
  innerH: number
): string {
  if (!steps.length) return "";
  const padL = CHART.pad.l;
  const padT = CHART.pad.t;
  let d = "";
  steps.forEach((step, i) => {
    const x0 = xScale(step.t0, innerW, padL);
    const x1 = xScale(step.t1, innerW, padL);
    const y = yScale(step.mdKw, yMin, yMax, innerH, padT);
    if (i === 0) d = `M ${x0.toFixed(2)} ${y.toFixed(2)} L ${x1.toFixed(2)} ${y.toFixed(2)}`;
    else {
      const yPrev = yScale(steps[i - 1].mdKw, yMin, yMax, innerH, padT);
      d += ` L ${x0.toFixed(2)} ${yPrev.toFixed(2)} L ${x0.toFixed(2)} ${y.toFixed(2)} L ${x1.toFixed(2)} ${y.toFixed(2)}`;
    }
  });
  return d;
}

function niceYBounds(minKw: number, maxKw: number, targetMdKw: number) {
  const lo = Math.min(minKw, targetMdKw);
  const hi = Math.max(maxKw, targetMdKw);
  const padding = (hi - lo) * 0.12 || 80;
  const yMin = Math.floor((lo - padding) / 100) * 100;
  const yMax = Math.ceil((hi + padding) / 100) * 100;
  return { yMin, yMax };
}

export function PeakDemandChartViz({
  plant,
  title,
  legendMd,
  legendPower,
  statMinLabel,
  statMaxLabel,
  statMeanLabel,
  peakPeriodLabel,
  refMaxLabel,
  refMinLabel,
  refTargetLabel,
  timeStartLabel,
  timeEndLabel,
  yAxisUnit,
}: PeakDemandChartVizProps) {
  const gradientId = useId().replace(/:/g, "");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 4000);
    return () => clearInterval(id);
  }, [plant.id]);

  const series = useMemo(() => buildPeakPeriodSeries(plant, tick), [plant, tick]);
  const { yMin, yMax } = useMemo(
    () => niceYBounds(series.minKw, series.maxKw, series.targetMdKw),
    [series]
  );

  const innerW = CHART.w - CHART.pad.l - CHART.pad.r;
  const innerH = CHART.h - CHART.pad.t - CHART.pad.b;

  const powerCoords = series.power.map((p) => ({
    x: xScale(p.t, innerW, CHART.pad.l),
    y: yScale(p.powerKw, yMin, yMax, innerH, CHART.pad.t),
  }));
  const lineD = jaggedPath(powerCoords);
  const baseY = CHART.h - CHART.pad.b;
  const fillD = `${lineD} L ${powerCoords[powerCoords.length - 1].x.toFixed(2)} ${baseY} L ${powerCoords[0].x.toFixed(2)} ${baseY} Z`;
  const mdD = mdStepPath(series.mdSteps, yMin, yMax, innerW, innerH);

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    Math.round(yMin + ((yMax - yMin) * i) / (yTicks - 1))
  );

  const refLines = [
    { value: series.maxKw, color: "#dc2626", label: refMaxLabel(formatKw(series.maxKw)), dash: "5 4" },
    {
      value: series.targetMdKw,
      color: "#9333ea",
      label: refTargetLabel(formatKw(series.targetMdKw)),
      dash: "6 4",
    },
    { value: series.minKw, color: "#16a34a", label: refMinLabel(formatKw(series.minKw)), dash: "5 4" },
  ];

  const hourTicks = peakPeriodTickHours();

  return (
    <div className={cn("rounded-lg p-4", dash.card)}>
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.06] sm:p-5">
        <div className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-4 text-center text-sm sm:gap-6">
          <div>
            <span className="text-slate-500">{statMinLabel}</span>
            <p className="mt-0.5 font-semibold tabular-nums text-[#2563eb]">{formatKw(series.minKw)}</p>
          </div>
          <div>
            <span className="text-slate-500">{statMaxLabel}</span>
            <p className="mt-0.5 font-semibold tabular-nums text-[#2563eb]">{formatKw(series.maxKw)}</p>
          </div>
          <div>
            <span className="text-slate-500">{statMeanLabel}</span>
            <p className="mt-0.5 font-semibold tabular-nums text-[#2563eb]">{formatKw(series.meanKw)}</p>
          </div>
        </div>

        <h3 className="mt-4 text-center text-base font-bold text-slate-900 sm:text-lg">{title}</h3>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="h-0.5 w-6 rounded bg-[#dc2626]" aria-hidden />
            {legendMd}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-0.5 w-6 rounded bg-[#2563eb]" aria-hidden />
            {legendPower}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          className="mt-2 h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTickValues.map((val) => {
            const y = yScale(val, yMin, yMax, innerH, CHART.pad.t);
            return (
              <g key={val}>
                <line
                  x1={CHART.pad.l}
                  y1={y}
                  x2={CHART.w - CHART.pad.r}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
                <text x={CHART.pad.l - 8} y={y + 4} textAnchor="end" fill="#64748b" fontSize="10">
                  {val}
                </text>
              </g>
            );
          })}

          <text
            x={12}
            y={CHART.pad.t + innerH / 2}
            fill="#64748b"
            fontSize="10"
            transform={`rotate(-90 12 ${CHART.pad.t + innerH / 2})`}
            textAnchor="middle"
          >
            {yAxisUnit}
          </text>

          {hourTicks.map((h) => {
            const t = (h - PEAK_PERIOD_START_HOUR) / (PEAK_PERIOD_END_HOUR - PEAK_PERIOD_START_HOUR);
            const x = xScale(t, innerW, CHART.pad.l);
            return (
              <g key={h}>
                <line
                  x1={x}
                  y1={CHART.pad.t}
                  x2={x}
                  y2={CHART.h - CHART.pad.b}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text x={x} y={CHART.h - 14} textAnchor="middle" fill="#64748b" fontSize="9">
                  {peakPeriodHourLabel(h)}
                </text>
              </g>
            );
          })}

          <text x={CHART.pad.l} y={CHART.h - 4} fill="#64748b" fontSize="8" textAnchor="start">
            {timeStartLabel}
          </text>
          <text x={CHART.w - CHART.pad.r} y={CHART.h - 4} fill="#64748b" fontSize="8" textAnchor="end">
            {timeEndLabel}
          </text>

          {refLines.map((ref) => {
            const y = yScale(ref.value, yMin, yMax, innerH, CHART.pad.t);
            return (
              <g key={ref.label}>
                <line
                  x1={CHART.pad.l}
                  y1={y}
                  x2={CHART.w - CHART.pad.r}
                  y2={y}
                  stroke={ref.color}
                  strokeWidth="1.25"
                  strokeDasharray={ref.dash}
                  opacity={0.85}
                />
                <text x={CHART.pad.l + 4} y={y - 4} fill={ref.color} fontSize="9" fontWeight="600">
                  {ref.label}
                </text>
              </g>
            );
          })}

          <motion.path
            d={fillD}
            fill={`url(#${gradientId})`}
            initial={false}
            animate={{ d: fillD }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d={lineD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.75"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: lineD }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d={mdD}
            fill="none"
            stroke="#dc2626"
            strokeWidth="3"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: mdD }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>

        <p className="mt-2 text-center text-xs text-slate-500">{peakPeriodLabel}</p>
      </div>
    </div>
  );
}
