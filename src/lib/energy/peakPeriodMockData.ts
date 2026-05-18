import type { PlantMock } from "./mockData";
import { PEAK_PERIOD_END_HOUR, PEAK_PERIOD_START_HOUR } from "./mockData";

export { PEAK_PERIOD_END_HOUR, PEAK_PERIOD_START_HOUR };
export const PEAK_POWER_POINTS = 96;
export const PEAK_MD_BUCKETS = 16;

export type PeakPowerPoint = {
  /** 0–1 across peak window */
  t: number;
  powerKw: number;
};

export type PeakMdStep = {
  t0: number;
  t1: number;
  mdKw: number;
};

export type PeakPeriodSeries = {
  power: PeakPowerPoint[];
  mdSteps: PeakMdStep[];
  minKw: number;
  maxKw: number;
  meanKw: number;
  targetMdKw: number;
};

function hashSeed(id: string, tick: number): number {
  let h = tick * 997;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Jagged intraday power during 14:00–22:00, scaled to plant peak kW. */
export function buildPeakPeriodSeries(plant: PlantMock, tick = 0): PeakPeriodSeries {
  const seed = hashSeed(plant.id, tick);
  const peakKw = plant.currentPower;
  const floorKw = peakKw * 0.68;

  const power: PeakPowerPoint[] = Array.from({ length: PEAK_POWER_POINTS }, (_, i) => {
    const t = i / (PEAK_POWER_POINTS - 1);
    const phase = (seed % 17) * 0.02;
    const wave1 = Math.sin((t + phase) * Math.PI * 4.2) * 0.11;
    const wave2 = Math.sin((t + phase * 0.5) * Math.PI * 9.5) * 0.06;
    const wave3 = Math.sin((t + seed % 5) * Math.PI * 15) * 0.03;
    const ramp = (t - 0.5) * 0.14;
    const pseudoRand = Math.sin((i + seed) * 12.9898) * 43758.5453;
    const noise = (pseudoRand - Math.floor(pseudoRand) - 0.5) * 0.05;
    const factor = 0.78 + wave1 + wave2 + wave3 + ramp + noise;
    const powerKw = Math.round(Math.max(floorKw, Math.min(peakKw * 1.06, peakKw * factor)) * 10) / 10;
    return { t, powerKw };
  });

  const bucketSize = Math.floor(power.length / PEAK_MD_BUCKETS);
  const mdSteps: PeakMdStep[] = [];

  for (let b = 0; b < PEAK_MD_BUCKETS; b++) {
    const slice = power.slice(b * bucketSize, b === PEAK_MD_BUCKETS - 1 ? undefined : (b + 1) * bucketSize);
    const mdKw = Math.max(...slice.map((p) => p.powerKw));
    mdSteps.push({
      t0: b / PEAK_MD_BUCKETS,
      t1: (b + 1) / PEAK_MD_BUCKETS,
      mdKw,
    });
  }

  const values = power.map((p) => p.powerKw);
  const minKw = Math.min(...values);
  const maxKw = Math.max(...values);
  const meanKw = Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10;
  const targetMdKw = Math.round(meanKw * 0.98 * 10) / 10;

  return { power, mdSteps, minKw, maxKw, meanKw, targetMdKw };
}

export function peakPeriodHourLabel(hour24: number): string {
  const h = hour24 % 24;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${suffix}`;
}

export function peakPeriodTickHours(): number[] {
  const hours: number[] = [];
  for (let h = PEAK_PERIOD_START_HOUR; h <= PEAK_PERIOD_END_HOUR; h++) hours.push(h);
  return hours;
}
