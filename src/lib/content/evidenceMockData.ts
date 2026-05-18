/** Mock values derived from sample TNB bill, interval meter export, and analysis report */

export const tnbBillSummary = {
  billDate: "07/04/2026",
  accountMasked: "•••• 4821",
  tariff: "Bukan Domestik ToU · Voltan Sederhana",
  lines: [
    { label: "Caj tenaga (Energy)", amount: 70150.1 },
    { label: "Caj demand (Demand)", amount: 92595.24 },
    { label: "ICPT / lain-lain", amount: 3842.5 },
    { label: "Jumlah bil", amount: 166587.84 },
  ],
} as const;

/** Minute-level total power (kW) — pattern from interval export */
export const METER_INTERVAL_POINT_COUNT = 60;

export function buildMeterPowerSeries(length = METER_INTERVAL_POINT_COUNT): { label: string; kw: number }[] {
  const base = 554;
  return Array.from({ length }, (_, i) => {
    const t = 14 * 60 + i;
    const h = Math.floor(t / 60);
    const m = t % 60;
    const wave =
      Math.sin((i / length) * Math.PI * 2.4) * 16 +
      Math.sin((i / length) * Math.PI * 5.2) * 8 +
      Math.cos((i / length) * Math.PI * 3.1) * 6;
    const micro = Math.sin(i * 0.85) * 3;
    return {
      label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      kw: Math.round((base + wave + micro) * 10) / 10,
    };
  });
}

export const costMetricsReport = {
  title: "Cost and load metrics",
  costMix: {
    energyRm: 70150.1,
    demandRm: 92595.24,
    energyShare: 43.1,
  },
  timeOfUse: {
    peakKwh: 67114,
    offPeakKwh: 180426,
    peakShare: 27.1,
  },
  loadFactor: {
    fromBill: 0.36,
    implied: 0.3604,
    effective: 0.36,
  },
  maxDemand: {
    billedKw: 954,
    declaredKw: 1619,
    ratio: 0.5893,
  },
} as const;
