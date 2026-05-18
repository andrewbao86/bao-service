import { WHATSAPP_BASE, WHATSAPP_ENERGY_BASE } from "./constants";

export function whatsappLink(text: string, base: string = WHATSAPP_BASE): string {
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function whatsappEnergyLink(text: string): string {
  return whatsappLink(text, WHATSAPP_ENERGY_BASE);
}

export const WHATSAPP_MESSAGES = {
  general:
    "Hi Bao Service, I'm interested in your products and services.",
  energy:
    "Hi Bao Service, I'd like to learn about your energy efficiency monitoring solutions.",
  energyAssessment:
    "Hi Bao Service, I'd like a free energy assessment for my facility.",
  energyTnbReport:
    "Hi Bao Service, I'd like to request a free TNB bill analysis report for my facility.",
  equipment: (name: string) =>
    `Hi Bao Service, I'm interested in ${name}.`,
  project: (name: string) =>
    `Hi Bao Service, I'm interested in ${name}.`,
  pm: "Hi Bao Service, I'd like to discuss project management support.",
} as const;
