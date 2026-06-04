"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import {
  HIRING_DIRECTIONS,
  HIRING_ENGAGEMENT,
  HIRING_STUDIED_MOST,
} from "@/lib/hiring";
import { captureHiringTracking, getStudiedSolutions } from "@/lib/hiring/tracking";
import { cn } from "@/lib/utils";
import { HiringProgressChips } from "./HiringProgressChips";

const inputClass =
  "w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50";

type HiringPitchFormProps = {
  locale: Locale;
};

export function HiringPitchForm({ locale }: HiringPitchFormProps) {
  const t = useTranslations("hiring.form");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [studiedMost, setStudiedMost] = useState("");
  const [cvAccepted, setCvAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const tracking = useMemo(() => captureHiringTracking(locale), [locale]);

  useEffect(() => {
    if (!submitted) return;
    requestAnimationFrame(() => {
      document.getElementById("pitch-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [submitted]);

  const showNotStudiedWarning = studiedMost === "not-studied";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSubmitError(false);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      direction: form.get("direction"),
      contribution: form.get("contribution"),
      valuePitch: form.get("valuePitch"),
      proof: form.get("proof"),
      first30DaysIdea: form.get("first30DaysIdea"),
      preferredEngagement: form.get("preferredEngagement"),
      cvLink: form.get("cvLink"),
      portfolioLink: form.get("portfolioLink"),
      studiedMostClosely: form.get("studiedMostClosely"),
      studiedSolutions: getStudiedSolutions(),
      cvAccessReminderAccepted: cvAccepted,
      privacyConsentAccepted: privacyAccepted,
      locale,
      landingLocale: tracking.landingLocale,
      sourcePage: tracking.sourcePage,
      utmSource: tracking.utmSource,
      utmMedium: tracking.utmMedium,
      utmCampaign: tracking.utmCampaign,
      referrer: tracking.referrer,
      website: form.get("website"),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/hiring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted(true);
      e.currentTarget.reset();
      setStudiedMost("");
      setCvAccepted(false);
      setPrivacyAccepted(false);
    } catch {
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-slate-900 p-8 md:p-10 text-center text-white shadow-xl">
        <CheckCircle2 className="mx-auto h-12 w-12 text-teal-400" aria-hidden />
        <h3 className="mt-4 text-xl font-semibold">{t("successTitle")}</h3>
        <p className="mt-2 text-sm text-slate-300">{t("success")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl md:p-10">
      <HiringProgressChips locale={locale} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div className="grid gap-5 md:grid-cols-2">
          <Field label={t("name")} name="name" required disabled={loading} />
          <Field label={t("email")} name="email" type="email" required disabled={loading} />
        </div>
        <Field label={t("phone")} name="phone" type="tel" disabled={loading} />

        <SelectField
          label={t("studiedMostLabel")}
          name="studiedMostClosely"
          required
          disabled={loading}
          value={studiedMost}
          onChange={(e) => setStudiedMost(e.target.value)}
          options={HIRING_STUDIED_MOST.map((v) => ({ value: v, label: t(`studiedMost.${v}`) }))}
        />
        {showNotStudiedWarning ? (
          <p className="rounded-md bg-amber-950/60 px-3 py-2 text-sm text-amber-200" role="status">
            {t("notStudiedWarning")}
          </p>
        ) : null}

        <SelectField
          label={t("directionLabel")}
          name="direction"
          required
          disabled={loading}
          options={HIRING_DIRECTIONS.map((v) => ({ value: v, label: t(`direction.${v}`) }))}
        />

        <TextArea label={t("contributionLabel")} name="contribution" required disabled={loading} rows={4} placeholder={t("contributionPlaceholder")} />
        <TextArea label={t("valuePitchLabel")} name="valuePitch" required disabled={loading} rows={3} />
        <TextArea label={t("proofLabel")} name="proof" required disabled={loading} rows={3} />
        <TextArea label={t("first30DaysLabel")} name="first30DaysIdea" required disabled={loading} rows={3} placeholder={t("first30DaysPlaceholder")} />

        <SelectField
          label={t("engagementLabel")}
          name="preferredEngagement"
          required
          disabled={loading}
          options={HIRING_ENGAGEMENT.map((v) => ({ value: v, label: t(`engagement.${v}`) }))}
        />

        <Field label={t("cvLinkLabel")} name="cvLink" type="url" required disabled={loading} placeholder="https://" />
        <div className="rounded-md bg-teal-950/50 px-3 py-3 text-sm text-teal-100/90 ring-1 ring-teal-500/20">
          <p>{t("cvLinkWarning1")}</p>
          <p className="mt-1">{t("cvLinkWarning2")}</p>
        </div>

        <Field label={t("portfolioLinkLabel")} name="portfolioLink" type="url" disabled={loading} placeholder="https://" />

        <label className="flex items-start gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={cvAccepted}
            onChange={(e) => setCvAccepted(e.target.checked)}
            className="mt-1 rounded border-slate-600"
            required
          />
          <span>{t("cvAccessConfirm")}</span>
        </label>

        <label className="flex items-start gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1 rounded border-slate-600"
            required
          />
          <span>
            {t("privacyConsent")}{" "}
            <Link href={`/${locale}/privacy`} className="text-teal-300 underline hover:text-teal-200">
              {t("privacyLink")}
            </Link>
          </span>
        </label>
        <p className="text-xs text-slate-500">{t("privacyNote")}</p>

        {submitError ? (
          <p className="rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-300" role="alert">
            {t("error")}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={loading || !cvAccepted || !privacyAccepted}>
          {loading ? t("submitting") : t("submit")}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  disabled,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-200">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  required,
  disabled,
  rows,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  rows: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-200">{label}</label>
      <textarea
        name={name}
        rows={rows}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(inputClass, "resize-y min-h-[5rem]")}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  required,
  disabled,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-200">{label}</label>
      <select
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={inputClass}
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
