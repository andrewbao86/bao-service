"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/content/products";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { surface } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export function ProductsSectionIntro() {
  const t = useTranslations("home");
  return (
    <div className="pt-20 md:pt-28 pb-8">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">{t("productsTitle")}</h2>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">{t("productsSub")}</p>
      </div>
    </div>
  );
}

export function ProductsCarouselSection() {
  const t = useTranslations("home");
  const reduced = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  const scrollBy = useCallback((dir: number) => {
    const el = scrollRef.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    const step = card.offsetWidth + 16;
    indexRef.current = (indexRef.current + dir + products.length) % products.length;
    el.scrollTo({ left: indexRef.current * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      const card = el?.querySelector<HTMLElement>("[data-card]");
      if (!el || !card) return;
      const step = card.offsetWidth + 16;
      indexRef.current = (indexRef.current + 1) % products.length;
      el.scrollTo({ left: indexRef.current * step, behavior: "smooth" });
    }, 4000);
    return () => clearInterval(interval);
  }, [reduced]);

  return (
    <section id="products" className="pb-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900">{t("deliveredTitle")}</h3>
            <p className="text-slate-600 mt-2">{t("deliveredSub")}</p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button type="button" variant="outline" onClick={() => scrollBy(-1)} aria-label="Previous">
              ‹
            </Button>
            <Button type="button" variant="outline" onClick={() => scrollBy(1)} aria-label="Next">
              ›
            </Button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin"
          style={{ scrollBehavior: "smooth" }}
          aria-label="Delivered products carousel"
        >
          {products.map((p, index) => (
            <article
              key={p.id}
              data-card
              className={cn(
                "snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[33%] lg:w-[30%] xl:w-[28%] overflow-hidden",
                surface.card
              )}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 85vw, 33vw"
                  loading={index === 0 ? undefined : "lazy"}
                />
              </div>
              <div className="p-4">
                <h4 className="text-base font-semibold text-slate-900">{p.name}</h4>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
