"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { tnbBillSummary } from "@/lib/content/evidenceMockData";
import { formatRinggit } from "@/lib/energy/mockData";
import { EvidenceVizCard } from "./EvidenceVizCard";

export function TnbBillSummaryViz() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <EvidenceVizCard className="min-h-[260px]">
      <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">TNB</p>
          <p className="text-sm font-semibold text-slate-900">Bil Elektrik</p>
        </div>
        <p className="text-right text-[10px] text-slate-500">
          {tnbBillSummary.billDate}
          <br />
          {tnbBillSummary.accountMasked}
        </p>
      </div>
      <p className="mt-2 text-[11px] font-medium text-brand-700">{tnbBillSummary.tariff}</p>
      <p className="mt-3 text-xs font-semibold text-slate-700">Ringkasan bil (RM)</p>
      <ul className="mt-2 flex-1 space-y-2">
        {tnbBillSummary.lines.map((line, i) => (
          <motion.li
            key={line.label}
            className="flex items-center justify-between gap-2 text-xs"
            initial={{ opacity: 0, x: -8 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
          >
            <span className="text-slate-600">{line.label}</span>
            <motion.span
              className={cnAmount(line.label)}
              initial={{ opacity: 0 }}
              animate={visible ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 + i * 0.1 }}
            >
              {formatRinggit(line.amount)}
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </EvidenceVizCard>
  );
}

function cnAmount(label: string) {
  return label.includes("Jumlah")
    ? "font-semibold tabular-nums text-slate-900"
    : "tabular-nums text-slate-800";
}
