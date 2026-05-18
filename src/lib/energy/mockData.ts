/** Reference plant for demo dashboard scaling (Main Production Facility) */
export const DEMO_BASE_POWER_KW = 1500;
export const DEMO_BASE_ENERGY_KWH = 250_000;
export const DEMO_NOMINAL_VOLTAGE_KV = 11;

const SQRT3 = Math.sqrt(3);
const LINE_VOLTS = DEMO_NOMINAL_VOLTAGE_KV * 1000;
const DEFAULT_PF = 0.92;

export interface MeterReading {
  /** Nominal line voltage (kV) */
  voltage: number;
  ampere: number;
  power: number;
  reactivePower: number;
  energy: number;
  timestamp: Date;
}

export interface PlantMock {
  id: string;
  name: string;
  currentPower: number;
  offPeakPower: number;
  currentEnergy: number;
}

export const mockPlants: PlantMock[] = [
  {
    id: "plant-1",
    name: "Main Production Facility",
    currentPower: 1520,
    offPeakPower: 880,
    currentEnergy: 248_500,
  },
  {
    id: "plant-2",
    name: "Warehouse & Logistics",
    currentPower: 820,
    offPeakPower: 480,
    currentEnergy: 132_000,
  },
  {
    id: "plant-3",
    name: "Office & Admin Block",
    currentPower: 360,
    offPeakPower: 210,
    currentEnergy: 58_400,
  },
];

function currentFromPowerKw(powerKw: number, pf = DEFAULT_PF): number {
  const amps = (powerKw * 1000) / (SQRT3 * LINE_VOLTS * pf);
  return Math.round(amps * 10) / 10;
}

function reactiveFromPowerKw(powerKw: number, pf = DEFAULT_PF): number {
  const kvar = powerKw * Math.tan(Math.acos(pf));
  return Math.round(kvar * 10) / 10;
}

/** Live meter snapshot scaled to plant size (11 kV class, MW-scale load). */
export function generateReading(multiplier = 1): MeterReading {
  const pf = 0.9 + Math.random() * 0.05;
  const power =
    Math.round(DEMO_BASE_POWER_KW * multiplier * (0.97 + Math.random() * 0.06) * 10) / 10;
  const energy = Math.round(
    DEMO_BASE_ENERGY_KWH * multiplier * (0.999 + Math.random() * 0.002)
  );

  return {
    voltage: Math.round((DEMO_NOMINAL_VOLTAGE_KV + (Math.random() - 0.5) * 0.04) * 100) / 100,
    ampere: currentFromPowerKw(power, pf),
    power,
    reactivePower: reactiveFromPowerKw(power, pf),
    energy,
    timestamp: new Date(),
  };
}

const compact = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 });

export function formatDemoVoltageKv(kv: number): string {
  return `${compact.format(kv)} kV`;
}

export function formatDemoPowerKw(kw: number): string {
  return `${compact.format(kw)} kW`;
}

export function formatDemoEnergyKwh(kwh: number): string {
  return `${integer.format(kwh)} kWh`;
}

/** TNB-style weekday peak window: 14:00–22:00 Mon–Fri; all other times off-peak. */
export const PEAK_PERIOD_START_HOUR = 14;
export const PEAK_PERIOD_END_HOUR = 22;

export function isWeekday(date = new Date()): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function isPeakHour(date = new Date()): boolean {
  if (!isWeekday(date)) return false;
  const hour = date.getHours();
  return hour >= PEAK_PERIOD_START_HOUR && hour < PEAK_PERIOD_END_HOUR;
}

const ringgitFormatter = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  maximumFractionDigits: 0,
});

export function formatRinggit(amount: number): string {
  return ringgitFormatter.format(amount);
}

export function formatRinggitPerMonth(amount: number): string {
  return `${formatRinggit(amount)}/month`;
}
