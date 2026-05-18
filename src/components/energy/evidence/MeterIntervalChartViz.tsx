"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { buildMeterPowerSeries, METER_INTERVAL_POINT_COUNT } from "@/lib/content/evidenceMockData";
import { EvidenceVizCard } from "./EvidenceVizCard";

const CHART = { w: 320, h: 88, pad: { l: 36, r: 12, t: 10, b: 14 } };

function chartCoords(series: { kw: number }[], min: number, max: number) {
  const innerW = CHART.w - CHART.pad.l - CHART.pad.r;
  const innerH = CHART.h - CHART.pad.t - CHART.pad.b;
  const range = max - min || 1;

  return series.map((p, i) => ({
    x: CHART.pad.l + (i / Math.max(series.length - 1, 1)) * innerW,
    y: CHART.pad.t + innerH - ((p.kw - min) / range) * innerH,
  }));
}

/** Smooth cubic Bézier through points (dashboard-style curve) */
function smoothLinePath(coords: { x: number; y: number }[]): string {
  if (coords.length < 2) return "";
  const first = coords[0];
  let d = `M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] ?? coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function areaPath(lineD: string, coords: { x: number; y: number }[]): string {
  const last = coords[coords.length - 1];
  const first = coords[0];
  const baseY = CHART.h - CHART.pad.b;
  return `${lineD} L ${last.x.toFixed(2)} ${baseY} L ${first.x.toFixed(2)} ${baseY} Z`;
}

export function MeterIntervalChartViz() {
  const gradientId = useId().replace(/:/g, "");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 2800);
    return () => clearInterval(id);
  }, []);

  const series = useMemo(() => {
    const base = buildMeterPowerSeries(METER_INTERVAL_POINT_COUNT);
    const shift = (tick % 5) - 2;
    return base.map((p, i) => ({
      ...p,
      kw: Math.round((p.kw + shift + Math.sin((i + tick) / 12) * 2.5) * 10) / 10,
    }));
  }, [tick]);

  const min = Math.min(...series.map((p) => p.kw));
  const max = Math.max(...series.map((p) => p.kw));
  const coords = chartCoords(series, min, max);
  const lineD = smoothLinePath(coords);
  const fillD = areaPath(lineD, coords);

  const innerH = CHART.h - CHART.pad.t - CHART.pad.b;
  const gridYs = [0.25, 0.5, 0.75].map(
    (t) => CHART.pad.t + innerH * (1 - t)
  );
  const yLabels = [max, min + (max - min) / 2, min].map((v) => Math.round(v));

  return (
    <EvidenceVizCard className="min-h-[260px]">
      <p className="text-xs font-semibold text-slate-800">Interval meter — total power</p>
      <p className="mt-0.5 text-[10px] text-slate-500">07/04/2026 · 1-min readings (sample)</p>
      <div className="mt-3 flex-1">
        <svg
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          className="h-32 w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Total power trend over ${METER_INTERVAL_POINT_COUNT} one-minute intervals`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
              <stop offset="55%" stopColor="#2563eb" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
            <filter id={`${gradientId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {gridYs.map((y, i) => (
            <g key={i}>
              <line
                x1={CHART.pad.l}
                y1={y}
                x2={CHART.w - CHART.pad.r}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="0.75"
                strokeDasharray="3 4"
              />
              <text
                x={CHART.pad.l - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-slate-400"
                fontSize="7"
              >
                {yLabels[i]}
              </text>
            </g>
          ))}

          <motion.path
            d={fillD}
            fill={`url(#${gradientId})`}
            initial={false}
            animate={{ d: fillD }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.path
            d={lineD}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${gradientId}-glow)`}
            initial={false}
            animate={{ d: lineD }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          />
          {coords
            .filter((_, i) => i % 10 === 0 || i === coords.length - 1)
            .map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r="1.25"
                fill="#fff"
                stroke="#2563eb"
                strokeWidth="1"
              />
            ))}
        </svg>
        <motion.div
          className="mt-2 grid grid-cols-3 gap-2 text-[10px]"
          key={tick}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
        >
          <Stat label="Min" value={`${min.toFixed(0)} kW`} />
          <Stat label="Max" value={`${max.toFixed(0)} kW`} />
          <Stat label="Points" value={`${series.length} min`} />
        </motion.div>
      </div>
    </EvidenceVizCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-1.5 ring-1 ring-slate-900/[0.04]">
      <div className="text-slate-500">{label}</div>
      <div className="font-medium tabular-nums text-slate-800">{value}</div>
    </div>
  );
}
