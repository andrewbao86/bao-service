"use client";

import { useTranslations } from "next-intl";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { buildTnbAnalysisMailtoLink } from "@/lib/energy/tnbAnalysisMailto";
import { cn } from "@/lib/utils";

type EnergyTnbMailCtaProps = {
  size?: NonNullable<ButtonProps["size"]>;
  className?: string;
};

export function useTnbAnalysisMailto() {
  const t = useTranslations("energy");
  return buildTnbAnalysisMailtoLink(t("tnbMailSubject"), t("tnbMailBody"));
}

export function EnergyTnbMailCta({ size = "lg", className }: EnergyTnbMailCtaProps) {
  const t = useTranslations("energy");
  const href = useTnbAnalysisMailto();

  return (
    <a
      href={href}
      className={cn(buttonVariants({ variant: "default", size }), className)}
    >
      {t("ctaFreeReport")}
    </a>
  );
}
