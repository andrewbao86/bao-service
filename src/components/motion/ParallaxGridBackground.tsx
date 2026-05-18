"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export function ParallaxGridBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -24]);
  const y2 = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 16]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0 opacity-60">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100,116,139,0.35)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl"
      />
    </motion.div>
  );
}
