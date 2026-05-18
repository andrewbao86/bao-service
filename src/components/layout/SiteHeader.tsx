"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { WHATSAPP_BASE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

interface SiteHeaderProps {
  locale: Locale;
  onGetStarted?: () => void;
  /** When set, primary CTA opens the user's email client instead of calling onGetStarted */
  getStartedHref?: string;
  getStartedLabel?: string;
  whatsappHref?: string;
  /** When true, nav links point to home page anchors */
  linkToHome?: boolean;
}

export function SiteHeader({
  locale,
  onGetStarted,
  getStartedHref,
  getStartedLabel,
  whatsappHref = WHATSAPP_BASE,
  linkToHome = false,
}: SiteHeaderProps) {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const home = `/${locale}`;
  const prefix = linkToHome ? home : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: `${prefix}#services-projects`, label: t("whatWeDo") },
    { href: `${prefix}#products`, label: t("products") },
    { href: `${prefix}#how-we-deliver`, label: t("how") },
    { href: `${prefix}#faq`, label: t("faq") },
    { href: `${prefix}#contact`, label: t("contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 ${
        scrolled ? "shadow-lg bg-white/95" : "shadow-sm"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        <Link href={home} className="hover:opacity-80 transition-opacity flex-shrink-0">
          <Image src="/logo.svg" alt="BAO SERVICE" width={120} height={40} className="h-10 w-auto" priority />
        </Link>

        <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
          <div className="flex items-center justify-between w-full max-w-2xl">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-slate-700 hover:text-brand-600 transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <LocaleSwitcher locale={locale} />
          {getStartedHref ? (
            <a
              href={getStartedHref}
              className={cn(buttonVariants({ variant: "default" }), "whitespace-nowrap")}
            >
              {getStartedLabel ?? tCta("getStarted")}
            </a>
          ) : (
            <Button onClick={onGetStarted} className="whitespace-nowrap">
              {tCta("getStarted")}
            </Button>
          )}
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="whitespace-nowrap">
              {tCta("whatsappUs")}
            </Button>
          </a>
        </div>

        <div className="lg:hidden flex items-center gap-3 min-w-0">
          <LocaleSwitcher locale={locale} />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md hover:bg-slate-100 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6 text-slate-700" /> : <Menu className="h-6 w-6 text-slate-700" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur overflow-hidden"
          >
            <nav className="px-4 sm:px-6 py-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 px-4 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-brand-600 font-medium"
                >
                  {item.label}
                </a>
              ))}
              <MobileCtas
                onGetStarted={
                  onGetStarted
                    ? () => {
                        onGetStarted();
                        setMobileOpen(false);
                      }
                    : undefined
                }
                getStartedHref={getStartedHref}
                getStartedLabel={getStartedLabel}
                whatsappHref={whatsappHref}
                tCta={tCta}
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileCtas({
  onGetStarted,
  getStartedHref,
  getStartedLabel,
  whatsappHref,
  onNavigate,
  tCta,
}: {
  onGetStarted?: () => void;
  getStartedHref?: string;
  getStartedLabel?: string;
  whatsappHref: string;
  onNavigate: () => void;
  tCta: ReturnType<typeof useTranslations<"cta">>;
}) {
  const label = getStartedLabel ?? tCta("getStarted");

  return (
    <div className="pt-3 border-t border-slate-200/80 space-y-3">
      {getStartedHref ? (
        <a
          href={getStartedHref}
          onClick={onNavigate}
          className={cn(buttonVariants({ variant: "default" }), "w-full font-medium")}
        >
          {label}
        </a>
      ) : (
        <Button onClick={onGetStarted} className="w-full font-medium">
          {label}
        </Button>
      )}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block py-2 px-3 rounded-md bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors text-center font-medium"
      >
        {tCta("whatsappUsMobile")}
      </a>
    </div>
  );
}
