"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import type { HiringUpdate } from "@/lib/hiring/updates";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const ROTATE_MS = 4000;
const EXIT_MS = 250;
const ENTER_MS = 300;

type HiringHeroUpdatesCarouselProps = {
  items: HiringUpdate[];
  className?: string;
};

function getVisibleWindow(items: HiringUpdate[], start: number, visibleCount: number) {
  return Array.from({ length: Math.min(visibleCount, items.length) }, (_, i) => {
    return items[(start + i) % items.length];
  });
}

type HiringUpdateLineProps = {
  text: string;
  lineKey: string;
  isExpanded: boolean;
  onToggleExpand: (key: string | null) => void;
};

function HiringUpdateLine({ text, lineKey, isExpanded, onToggleExpand }: HiringUpdateLineProps) {
  const t = useTranslations("hiring.updates");
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const measure = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    setIsTruncated(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [text, measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const handleMobileToggle = () => {
    if (!isTruncated) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    onToggleExpand(isExpanded ? null : lineKey);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleMobileToggle();
  };

  return (
    <li className={cn("flex gap-2", isTruncated && "group/line relative")}>
      <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 bg-teal-400" aria-hidden />
      <div className="relative min-w-0 flex-1">
        <span
          ref={textRef}
          role={isTruncated ? "button" : undefined}
          tabIndex={isTruncated ? 0 : undefined}
          onClick={handleMobileToggle}
          onKeyDown={isTruncated ? handleKeyDown : undefined}
          aria-expanded={isTruncated ? isExpanded : undefined}
          aria-label={isTruncated ? t("expandHint") : undefined}
          title={isTruncated ? text : undefined}
          className={cn(
            "block text-sm leading-snug text-slate-200",
            !isExpanded && "line-clamp-2",
            isTruncated && "max-md:cursor-pointer max-md:rounded-sm max-md:focus-visible:outline max-md:focus-visible:outline-2 max-md:focus-visible:outline-teal-400/60"
          )}
        >
          {text}
        </span>

        {isTruncated ? (
          <div
            className="pointer-events-none absolute right-0 top-0 z-30 hidden min-w-[12rem] max-w-[18rem] rounded-md border border-teal-500/30 bg-slate-900/95 px-3 py-2 text-sm leading-snug text-slate-100 shadow-lg ring-1 ring-white/10 opacity-0 transition-opacity duration-150 md:block md:group-hover/line:opacity-100 md:group-focus-within/line:opacity-100"
            aria-hidden
          >
            {text}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function HiringHeroUpdatesCarousel({ items, className }: HiringHeroUpdatesCarouselProps) {
  const t = useTranslations("hiring.updates");
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const [paused, setPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [expandedLineKey, setExpandedLineKey] = useState<string | null>(null);

  const count = items.length;
  const safeIndex = count > 0 ? index % count : 0;
  const shouldRotate = count > visibleCount;
  const rangeStart = safeIndex + 1;
  const rangeEnd = Math.min(safeIndex + visibleCount, count);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setVisibleCount(mq.matches ? 3 : 4);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const advance = useCallback(() => {
    if (count <= 1) return;
    setExpandedLineKey(null);
    if (reduced || !shouldRotate) {
      setIndex((i) => (i + 1) % count);
      return;
    }
    setPhase("exit");
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % count);
      setPhase("enter");
      window.setTimeout(() => setPhase("idle"), ENTER_MS);
    }, EXIT_MS);
  }, [count, reduced, shouldRotate]);

  useEffect(() => {
    if (!shouldRotate || paused) return;
    const interval = window.setInterval(advance, ROTATE_MS);
    return () => window.clearInterval(interval);
  }, [advance, shouldRotate, paused]);

  const visibleItems = useMemo(
    () => getVisibleWindow(items, safeIndex, visibleCount),
    [items, safeIndex, visibleCount]
  );

  const listAnimationClass =
    phase === "exit"
      ? "hiring-updates-exit-up"
      : phase === "enter"
        ? "hiring-updates-enter"
        : "";

  return (
    <aside
      className={cn("w-full max-w-xs", className)}
      aria-label={t("label")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
          setExpandedLineKey(null);
        }
      }}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest('[role="button"]')) {
          setExpandedLineKey(null);
        }
      }}
    >
      <div className="border-t border-teal-500/40 pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-teal-300/90">
            {t("label")}
          </p>
          {shouldRotate ? (
            <p className="shrink-0 font-mono text-[0.6rem] tabular-nums tracking-wide text-teal-400/80">
              {t("range", { start: rangeStart, end: rangeEnd, total: count })}
            </p>
          ) : null}
        </div>

        {shouldRotate && !reduced ? (
          <div className="mt-2 h-px overflow-hidden bg-teal-500/20" aria-hidden>
            <div
              key={`progress-${safeIndex}`}
              className={cn(
                "h-full bg-teal-400/70 hiring-updates-progress",
                paused && "hiring-updates-progress-paused"
              )}
            />
          </div>
        ) : null}
      </div>

      {count > 0 ? (
        <div
          className={cn(
            "relative mt-2 h-[4.5rem] overflow-hidden md:h-[5.5rem]",
            shouldRotate && "hiring-updates-list-fade"
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {shouldRotate ? (
            <span className="sr-only">
              {t("position", { current: safeIndex + 1, total: count })}
            </span>
          ) : null}
          <ul key={`list-${safeIndex}`} className={cn("space-y-1.5", listAnimationClass)}>
            {visibleItems.map((item, i) => {
              const lineKey = `update-${safeIndex}-${i}`;
              return (
                <HiringUpdateLine
                  key={lineKey}
                  lineKey={lineKey}
                  text={item.text}
                  isExpanded={expandedLineKey === lineKey}
                  onToggleExpand={setExpandedLineKey}
                />
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="mt-2 text-sm leading-snug text-slate-400">{t("empty")}</p>
      )}
    </aside>
  );
}
