"use client";

import { useTranslations } from "next-intl";
import { Button, type ButtonProps } from "@/components/ui/button";

type EnergyTnbMailCtaProps = {
  size?: NonNullable<ButtonProps["size"]>;
  className?: string;
  onClick: () => void;
};

export function EnergyTnbMailCta({ size = "lg", className, onClick }: EnergyTnbMailCtaProps) {
  const t = useTranslations("energy");

  return (
    <Button type="button" size={size} className={className} onClick={onClick}>
      {t("ctaFreeReport")}
    </Button>
  );
}
