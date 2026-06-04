"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";

interface GetStartedModalProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  /** Overrides `?need=` query param when opening from a dedicated page CTA */
  need?: string;
  messageHint?: string;
}

const inputClass =
  "w-full rounded-md px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-0";

export function GetStartedModal({
  open,
  onClose,
  locale,
  need: needProp,
  messageHint,
}: GetStartedModalProps) {
  const t = useTranslations("modal");
  const tEnergy = useTranslations("energy");
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const need = needProp ?? searchParams.get("need") ?? "";
  const textareaDefault =
    messageHint ?? (need === "energy-tnb-report" ? tEnergy("tnbReportModalHint") : "");

  useEffect(() => {
    if (!open) return;
    // Reset when the modal opens so a prior submission does not persist.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on open
    setSubmitted(false);
    setSubmitError(false);
    setLoading(false);
  }, [open]);

  function handleDismiss() {
    setSubmitted(false);
    setSubmitError(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSubmitError(false);
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
      locale,
      need,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");

      formEl.reset();
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleDismiss}
      title={submitted ? t("successTitle") : t("title")}
    >
      {submitted ? (
        <div className="space-y-5 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-teal-600" aria-hidden />
          <p className="text-sm leading-relaxed text-slate-600">{t("success")}</p>
          <Button type="button" className="w-full" onClick={handleDismiss}>
            {t("successClose")}
          </Button>
        </div>
      ) : (
        <form id="quote-form" onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="need" id="need-input" defaultValue={need} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t("name")}</label>
            <input name="name" required className={inputClass} disabled={loading} />
          </div>
          <FormField label={t("email")} name="email" type="email" required disabled={loading} />
          <FormField label={t("phone")} name="phone" type="tel" disabled={loading} />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t("message")}</label>
            <textarea
              name="message"
              rows={4}
              className={inputClass}
              defaultValue={textareaDefault}
              key={textareaDefault ? `hint-${need}` : "default"}
              disabled={loading}
            />
          </div>
          {submitError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {t("error")}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("submitting") : t("submit")}
          </Button>
        </form>
      )}
    </Dialog>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className={inputClass}
      />
    </div>
  );
}
