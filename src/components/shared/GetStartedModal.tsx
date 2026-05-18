"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";

interface GetStartedModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  messageHint?: string;
}

const inputClass =
  "w-full rounded-md px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-0";

export function GetStartedModal({ open, onClose, locale, messageHint }: GetStartedModalProps) {
  const t = useTranslations("modal");
  const tEnergy = useTranslations("energy");
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const need = searchParams.get("need") || "";
  const textareaDefault =
    messageHint ?? (need === "energy-tnb-report" ? tEnergy("tnbReportModalHint") : "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
      locale,
      need: searchParams.get("need") || "",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      alert(t("success"));
      onClose();
      e.currentTarget.reset();
    } catch {
      alert(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={t("title")}>
      <form id="quote-form" onSubmit={handleSubmit} className="space-y-4">
        <input
          type="hidden"
          name="need"
          id="need-input"
          defaultValue={searchParams.get("need") || ""}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("name")}</label>
          <input name="name" required className={inputClass} />
        </div>
        <FormField label={t("email")} name="email" type="email" required />
        <FormField label={t("phone")} name="phone" type="tel" />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t("message")}</label>
          <textarea
            name="message"
            rows={4}
            className={inputClass}
            defaultValue={textareaDefault}
            key={textareaDefault ? `hint-${need}` : "default"}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("submitting") : t("submit")}
        </Button>
      </form>
    </Dialog>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input name={name} type={type} required={required} className={inputClass} />
    </div>
  );
}
