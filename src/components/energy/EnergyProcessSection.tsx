"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowDown,
  ArrowRight,
  FileSearch,
  LineChart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { section, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

const steps: {
  num: string;
  titleKey: "processStep1Title" | "processStep2Title" | "processStep3Title";
  descKey: "processStep1Desc" | "processStep2Desc" | "processStep3Desc";
  icon: LucideIcon;
}[] = [
  { num: "01", titleKey: "processStep1Title", descKey: "processStep1Desc", icon: FileSearch },
  { num: "02", titleKey: "processStep2Title", descKey: "processStep2Desc", icon: LineChart },
  { num: "03", titleKey: "processStep3Title", descKey: "processStep3Desc", icon: Sparkles },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function ProcessCard({
  step,
  title,
  description,
  variant = "step",
  outcomeLabel,
  className,
}: {
  step: (typeof steps)[number];
  title: string;
  description: string;
  variant?: "step" | "outcome";
  outcomeLabel?: string;
  className?: string;
}) {
  const Icon = step.icon;
  const isOutcome = variant === "outcome";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-300 md:p-7",
        isOutcome
          ? "bg-gradient-to-br from-brand-100 via-brand-50 to-white shadow-md ring-2 ring-brand-500/30"
          : "bg-white shadow-sm ring-1 ring-slate-900/[0.06] hover:-translate-y-0.5 hover:shadow-md hover:ring-brand-200/60",
        className
      )}
    >
      {isOutcome ? (
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-brand-400/15 blur-2xl"
          aria-hidden
        />
      ) : null}
      {isOutcome && outcomeLabel ? (
        <span className="mb-4 inline-flex w-fit rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-700 shadow-sm ring-1 ring-brand-400/40">
          {outcomeLabel}
        </span>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
            isOutcome
              ? "bg-brand-600 text-white shadow-md ring-brand-500/30"
              : "bg-brand-50 text-brand-700 ring-brand-100"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <span
          className={cn(
            "font-mono text-xs font-semibold tracking-widest",
            isOutcome ? "text-brand-600" : "text-slate-400"
          )}
        >
          {step.num}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
      <p className={cn("mt-3 text-sm leading-relaxed text-slate-600")}>{description}</p>
    </article>
  );
}

function FlowConnector({ direction }: { direction: "down" | "right" }) {
  const Icon = direction === "down" ? ArrowDown : ArrowRight;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-brand-200/70",
        direction === "down" ? "h-9 w-9" : "h-11 w-11"
      )}
      aria-hidden
    >
      <Icon className="h-4 w-4 text-brand-600" strokeWidth={2.5} />
    </div>
  );
}

export function EnergyProcessSection() {
  const t = useTranslations("energy");
  const [step1, step2, step3] = steps;

  return (
    <section className={cn("relative overflow-hidden py-20 md:py-28", section.alt)}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.08),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-brand-200/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.header
          className="max-w-2xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{t("processEyebrow")}</p>
          <h2 className={cn("mt-2 text-2xl font-semibold tracking-tight md:text-3xl", text.heading)}>
            {t("processTitle")}
          </h2>
          <p className={cn("mt-3 text-base leading-relaxed", text.body)}>{t("processSub")}</p>
        </motion.header>

        <motion.div
          className="mt-12 lg:mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] lg:items-center lg:gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="flex flex-col gap-5 lg:gap-6">
            <motion.div variants={fadeUp}>
              <ProcessCard step={step1} title={t(step1.titleKey)} description={t(step1.descKey)} />
            </motion.div>
            <div className="flex justify-center lg:hidden" aria-hidden>
              <FlowConnector direction="down" />
            </div>
            <motion.div variants={fadeUp}>
              <ProcessCard step={step2} title={t(step2.titleKey)} description={t(step2.descKey)} />
            </motion.div>
          </div>

          <div
            className="relative hidden lg:flex lg:self-stretch lg:flex-col lg:items-center lg:justify-between lg:py-6"
            aria-hidden
          >
            <div className="absolute inset-y-12 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-300/80 to-transparent" />
            <FlowConnector direction="right" />
            <FlowConnector direction="right" />
          </div>

          <div className="flex justify-center py-3 lg:hidden" aria-hidden>
            <FlowConnector direction="down" />
          </div>

          <motion.div variants={fadeUp} className="flex w-full items-center self-stretch">
            <ProcessCard
              step={step3}
              title={t(step3.titleKey)}
              description={t(step3.descKey)}
              variant="outcome"
              outcomeLabel={t("processOutcomeBadge")}
              className="w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
