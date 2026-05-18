export const processSteps = [
  {
    step: "01",
    title: "Specification Review",
    description:
      "We analyze your requirements and technical specifications to ensure the right fit.",
  },
  {
    step: "02",
    title: "Product Sourcing",
    description:
      "We source from trusted manufacturers, ensuring quality and compliance standards.",
  },
  {
    step: "03",
    title: "Quality Assurance",
    description:
      "Rigorous testing and verification before delivery to your facility.",
  },
  {
    step: "04",
    title: "Delivery & Support",
    description:
      "On-time delivery with ongoing technical support and documentation.",
  },
];

import type { LucideIcon } from "lucide-react";
import { Award, Globe, ShieldCheck, Truck } from "lucide-react";

export const strengths: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Engineering Expertise",
    description: "Certified engineers with decades of industrial experience",
    icon: Award,
  },
  {
    title: "Regional Support",
    description: "Local presence across Singapore, Malaysia, and Indonesia",
    icon: Globe,
  },
  {
    title: "Quality Assurance",
    description: "Rigorous testing and compliance verification",
    icon: ShieldCheck,
  },
  {
    title: "Fast Delivery",
    description: "Efficient logistics and on-time project completion",
    icon: Truck,
  },
];
