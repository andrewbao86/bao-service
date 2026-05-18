export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "gis",
    name: "22kV Gas Insulated Switchgear (GIS)",
    description:
      "We source and supply 22kV GIS switchgear from leading manufacturers like Schneider, Siemens, and ABB. Our team ensures specification compliance and handles the entire procurement process.",
    image: "/ai/products/product-1.jpg",
  },
  {
    id: "ais",
    name: "6.6kV Air Insulated Switchgear (AIS)",
    description:
      "Professional sourcing of 6.6kV AIS from multiple vendors. We manage specifications, quotations, and delivery coordination to meet your project timelines.",
    image: "/ai/products/product-2.jpg",
  },
  {
    id: "oil-transformer",
    name: "Oil-Immersed Power Transformer",
    description:
      "We source oil-immersed transformers from established manufacturers, managing the entire supply chain from specification review to on-site delivery and installation support.",
    image: "/ai/products/product-3.png",
  },
  {
    id: "dry-transformer",
    name: "Dry Transformer",
    description:
      "Professional sourcing of dry-type transformers with comprehensive project management. We handle vendor selection, technical compliance, and delivery coordination.",
    image: "/ai/products/product-4.jpg",
  },
  {
    id: "lv-switchgear",
    name: "Low Voltage Switchgear",
    description:
      "Multi-vendor sourcing of LV switchgear to meet your specific requirements. Our team manages the entire procurement process ensuring quality and timely delivery.",
    image: "/ai/products/product-5.jpg",
  },
  {
    id: "mcc",
    name: "Motor Control Center (MCC)",
    description:
      "We source and supply MCCs from leading manufacturers, managing specifications, vendor coordination, and ensuring compliance with your project requirements.",
    image: "/ai/products/product-6.png",
  },
  {
    id: "star-delta",
    name: "Star-Delta Starter",
    description:
      "Professional sourcing of star-delta starters with technical specification review. We coordinate with multiple vendors to ensure the best solution for your application.",
    image: "/ai/products/product-7.jpg",
  },
  {
    id: "vfd",
    name: "Variable Frequency Drive (VFD)",
    description:
      "Multi-vendor sourcing of VFDs with technical evaluation and project management. We ensure specification compliance and coordinate delivery to meet your timeline.",
    image: "/ai/products/product-8.jpg",
  },
  {
    id: "power-meter",
    name: "Power Meter",
    description:
      "We source power meters from leading manufacturers, managing the procurement process and ensuring technical specifications meet your monitoring and compliance needs.",
    image: "/ai/products/product-9.jpg",
  },
  {
    id: "earth-leakage",
    name: "Earth Leakage Relay",
    description:
      "Professional sourcing of earth leakage relays with technical specification review. Our team manages vendor coordination and ensures timely delivery for your safety systems.",
    image: "/ai/products/product-10.jpg",
  },
];
