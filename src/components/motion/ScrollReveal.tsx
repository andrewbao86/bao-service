"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "subtle";
};

export function ScrollReveal({ children, className, variant = "default" }: ScrollRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const y = variant === "subtle" ? 12 : 40;
  const duration = variant === "subtle" ? 0.25 : 0.6;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: variant === "subtle" ? "-100px" : "0px" }}
      transition={{ duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
