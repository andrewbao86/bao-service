"use client";

import { useTranslations } from "next-intl";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { ENERGY_PORTAL_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type EnergyPortalCtaProps = {
  size?: NonNullable<ButtonProps["size"]>;
  className?: string;
};

export function EnergyPortalCta({ size = "lg", className }: EnergyPortalCtaProps) {
  const t = useTranslations("energy");

  return (
    <a
      href={ENERGY_PORTAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: "portalOnDark", size }), className)}
    >
      {t("portalCta")}
    </a>
  );
}
