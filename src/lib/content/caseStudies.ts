export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  image: string;
  /** When set, card shows a single link CTA instead of WhatsApp buttons. */
  href?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "tuas",
    title: "Tuas Water Reclamation Plant (Singapore)",
    description:
      "Comprehensive electrical engineering design and complete system delivery including 66kV Gas Insulated Switchgear, power transformers, and Motor Control Centers for Singapore's largest water reclamation facility.",
    image: "/ai/TWRP.jpg",
  },
  {
    id: "vopak",
    title: "Vopak-Arkema NH3 & Castor Oil Feed System",
    description:
      "Complete Electrical & Instrumentation system design and field installation of 400V Variable Speed Drives for critical feed pump applications, ensuring precise flow control and operational efficiency.",
    image: "/ai/VOPAK.jpg",
  },
  {
    id: "airtrunk",
    title: "Air Trunk Data Center SGP1 (Singapore)",
    description:
      "Full project management and delivery of custom transformer kiosks featuring 22kV Ring Main Units, Dry-Type Transformers, and integrated Switchgear systems for critical data center power infrastructure.",
    image: "/ai/AT.jpg",
  },
  {
    id: "energy-malaysia",
    title: "Energy Cost Reduction (Malaysia)",
    description:
      "Our data-driven platform combines real-time metering, peak/off-peak analytics, and load optimization to help Malaysian industrial sites cut energy spend—with dashboards, alerts, and actionable recommendations from audit to sustained savings.",
    image: "/ai/energy-malaysia.jpg",
    href: "/energy-efficient",
  },
];
