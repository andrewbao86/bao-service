import type { PlantMock } from "./mockData";

export type ProportionSegment = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export type EnergyProportions = {
  timeOfUse: {
    peakKwh: number;
    offPeakKwh: number;
    peakShare: number;
    segments: ProportionSegment[];
  };
  costMix: {
    energyRm: number;
    demandRm: number;
    energyShare: number;
    segments: ProportionSegment[];
  };
  loadFactor: {
    value: number;
    pct: number;
  };
  mdUtilization: {
    billedKw: number;
    declaredKw: number;
    ratio: number;
    pct: number;
  };
  byCategory: {
    segments: ProportionSegment[];
  };
};

function hashSeed(id: string, tick: number): number {
  let h = tick * 991;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Monthly proportion breakdown scaled to plant size (demo). */
export function buildEnergyProportions(plant: PlantMock, tick = 0): EnergyProportions {
  const seed = hashSeed(plant.id, tick);
  const monthlyKwh = plant.currentEnergy * (0.92 + (seed % 9) * 0.01);

  const peakHoursPerWeek = 8 * 5;
  const weekdayOffHours = 16 * 5;
  const weekendHours = 48;
  const peakIntensity = plant.currentPower;
  const offIntensity = plant.offPeakPower;
  const peakWeight = peakHoursPerWeek * peakIntensity;
  const offWeight = weekdayOffHours * offIntensity + weekendHours * offIntensity;
  const peakKwh = Math.round((monthlyKwh * peakWeight) / (peakWeight + offWeight));
  const offPeakKwh = Math.round(monthlyKwh - peakKwh);
  const peakShare = Math.round((peakKwh / monthlyKwh) * 1000) / 10;

  const energyShare = 41 + (seed % 7);
  const totalRm = Math.round(plant.currentPower * 95 + plant.offPeakPower * 42 + 18000);
  const energyRm = Math.round((totalRm * energyShare) / 100);
  const demandRm = totalRm - energyRm;

  const loadFactor = Math.round((0.58 + (seed % 15) / 100) * 1000) / 1000;
  const declaredKw = Math.round(plant.currentPower * 1.08);
  const billedKw = Math.round(declaredKw * (0.82 + (seed % 8) / 100));
  const mdRatio = Math.round((billedKw / declaredKw) * 1000) / 1000;

  const prod = 48 + (seed % 5);
  const hvac = 26 + (seed % 4);
  const light = 14 + (seed % 3);
  const other = 100 - prod - hvac - light;

  return {
    timeOfUse: {
      peakKwh,
      offPeakKwh,
      peakShare,
      segments: [
        { id: "peak", label: "Peak", value: peakKwh, color: "#f97316" },
        { id: "off", label: "Off-peak", value: offPeakKwh, color: "#64748b" },
      ],
    },
    costMix: {
      energyRm,
      demandRm,
      energyShare,
      segments: [
        { id: "energy", label: "Energy", value: energyRm, color: "#2563eb" },
        { id: "demand", label: "Demand", value: demandRm, color: "#94a3b8" },
      ],
    },
    loadFactor: {
      value: loadFactor,
      pct: Math.round(loadFactor * 1000) / 10,
    },
    mdUtilization: {
      billedKw,
      declaredKw,
      ratio: mdRatio,
      pct: Math.round(mdRatio * 1000) / 10,
    },
    byCategory: {
      segments: [
        { id: "prod", label: "Production", value: prod, color: "#2dd4bf" },
        { id: "hvac", label: "HVAC", value: hvac, color: "#38bdf8" },
        { id: "light", label: "Lighting", value: light, color: "#a78bfa" },
        { id: "other", label: "Other", value: other, color: "#cbd5e1" },
      ],
    },
  };
}
