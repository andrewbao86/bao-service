"use client";

import { useEffect, useState } from "react";
import type { HiringUpdate } from "@/lib/hiring/updates";
import { HiringHeroUpdatesCarousel } from "./HiringHeroUpdatesCarousel";

type HiringHeroUpdatesProps = {
  className?: string;
};

export function HiringHeroUpdates({ className }: HiringHeroUpdatesProps) {
  const [items, setItems] = useState<HiringUpdate[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/hiring/updates", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { items?: HiringUpdate[] } | null) => {
        if (Array.isArray(data?.items)) setItems(data.items);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return <HiringHeroUpdatesCarousel items={items} className={className} />;
}
