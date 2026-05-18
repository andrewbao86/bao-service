"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { costMetricsReport } from "@/lib/content/evidenceMockData";
import { formatRinggit } from "@/lib/energy/mockData";
import { EvidenceVizCard } from "./EvidenceVizCard";

export function CostMetricsReportViz() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const { costMix, timeOfUse, loadFactor, maxDemand } = costMetricsReport;
  const costTotal = costMix.energyRm + costMix.demandRm;
  const kwhTotal = timeOfUse.peakKwh + timeOfUse.offPeakKwh;

  return (
    <EvidenceVizCard className="min-h-[320px] lg:min-h-0">
      <p className="text-sm font-semibold text-slate-900">{costMetricsReport.title}</p>

      <div className="mt-4 space-y-5">
        <MetricBlock title="Cost mix — energy vs demand (charges)">
          <StackedBar
            animate={animate}
            segments={[
              { pct: (costMix.energyRm / costTotal) * 100, color: "#2563eb", label: "Energy" },
              { pct: (costMix.demandRm / costTotal) * 100, color: "#94a3b8", label: "Demand" },
            ]}
          />
          <DataTable
            rows={[
              ["Energy-class charges", formatRinggit(costMix.energyRm)],
              ["Demand-class charges", formatRinggit(costMix.demandRm)],
              ["Energy share", `${costMix.energyShare}%`],
            ]}
            animate={animate}
          />
        </MetricBlock>

        <MetricBlock title="Time-of-use — kWh volumes (not RM split)">
          <StackedBar
            animate={animate}
            segments={[
              { pct: (timeOfUse.peakKwh / kwhTotal) * 100, color: "#f97316", label: "Peak" },
              { pct: (timeOfUse.offPeakKwh / kwhTotal) * 100, color: "#94a3b8", label: "Off-peak" },
            ]}
          />
          <DataTable
            rows={[
              ["Peak kWh", timeOfUse.peakKwh.toLocaleString("en-MY")],
              ["Off-peak kWh", timeOfUse.offPeakKwh.toLocaleString("en-MY")],
              ["Peak share", `${timeOfUse.peakShare}%`],
            ]}
            animate={animate}
            delay={0.08}
          />
        </MetricBlock>

        <MetricBlock title="Load factor">
          <LoadFactorScale value={loadFactor.effective} animate={animate} />
          <DataTable
            rows={[
              ["Load factor (from bill)", loadFactor.fromBill.toFixed(4)],
              ["Load factor (implied)", loadFactor.implied.toFixed(4)],
              ["Effective load factor used", loadFactor.effective.toFixed(4)],
            ]}
            animate={animate}
            delay={0.12}
          />
        </MetricBlock>

        <MetricBlock title="Declared vs billed maximum demand">
          <StackedBar
            animate={animate}
            segments={[{ pct: maxDemand.ratio * 100, color: "#2563eb", label: "Billed" }]}
            trackClassName="bg-slate-100"
          />
          <DataTable
            rows={[
              ["Effective billed MD", `${maxDemand.billedKw.toFixed(2)} kW`],
              ["Declared MD", `${maxDemand.declaredKw.toFixed(2)} kW`],
              ["Billed/declared ratio", maxDemand.ratio.toFixed(4)],
            ]}
            animate={animate}
            delay={0.16}
          />
        </MetricBlock>
      </div>
    </EvidenceVizCard>
  );
}

function MetricBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-700">{title}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

function StackedBar({
  segments,
  animate,
  trackClassName = "bg-slate-200/80",
}: {
  segments: { pct: number; color: string; label: string }[];
  animate: boolean;
  trackClassName?: string;
}) {
  return (
    <div className={cnTrack(trackClassName)}>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            className="h-full"
            style={{ backgroundColor: seg.color }}
            initial={{ width: 0 }}
            animate={{ width: animate ? `${seg.pct}%` : 0 }}
            transition={{ duration: 0.7, delay: 0.1 * i, ease: "easeOut" }}
            title={seg.label}
          />
        ))}
      </div>
    </div>
  );
}

function cnTrack(trackClassName: string) {
  return `rounded-full p-0.5 ${trackClassName}`;
}

function DataTable({
  rows,
  animate,
  delay = 0,
}: {
  rows: [string, string][];
  animate: boolean;
  delay?: number;
}) {
  return (
    <table className="w-full text-[10px]">
      <tbody>
        {rows.map(([k, v], i) => (
          <motion.tr
            key={k}
            initial={{ opacity: 0 }}
            animate={animate ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.2 + i * 0.05 }}
          >
            <td className="py-0.5 pr-2 text-slate-500">{k}</td>
            <td className="py-0.5 text-right font-medium tabular-nums text-slate-800">{v}</td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}

function LoadFactorScale({ value, animate }: { value: number; animate: boolean }) {
  const pct = value * 100;
  return (
    <div className="relative h-4 rounded-full bg-slate-100">
      <motion.div
        className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-red-500"
        initial={{ left: "0%" }}
        animate={{ left: animate ? `${pct}%` : "0%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <span className="absolute inset-x-2 top-1/2 block h-px -translate-y-1/2 bg-slate-300" aria-hidden />
    </div>
  );
}
