"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ADDRESS, CITY, EMAIL, FACEBOOK, LINKEDIN, UEN, WHATSAPP_BASE } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const home = `/${locale}`;

  return (
    <footer id="footer" className="bg-surface-darker text-slate-200 border-t border-slate-800/80">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <FooterBrand t={t} />
          </div>
          <div>
            <div className="font-semibold">{t("navigate")}</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`${home}#services-projects`} className="text-slate-300 hover:text-white">
                  What We Do
                </a>
              </li>
              <li>
                <a href={`${home}#products`} className="text-slate-300 hover:text-white">
                  Products & Quality
                </a>
              </li>
              <li>
                <a href={`${home}#how-we-deliver`} className="text-slate-300 hover:text-white">
                  How We Deliver
                </a>
              </li>
              <li>
                <a href={`${home}#faq`} className="text-slate-300 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href={`${home}#contact`} className="text-slate-300 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">{t("resources")}</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/project-management`} className="text-slate-300 hover:text-white">
                  {t("projectManagement")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/energy-efficient`} className="text-slate-300 hover:text-white">
                  {t("energyEfficient")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-slate-300 hover:text-white">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-slate-300 hover:text-white">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href={`${home}#contact`} className="text-slate-300 hover:text-white">
                  {t("requestQuote")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">{t("connect")}</div>
            <div className="mt-3 flex gap-3 text-sm">
              <a className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700" href={LINKEDIN} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700" href={FACEBOOK} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </div>
            <FooterUen />
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <div>© {year} {t("rights")}</div>
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/privacy`} className="hover:text-white">
              {t("privacy")}
            </Link>
            <span aria-hidden>·</span>
            <Link href={`/${locale}/terms`} className="hover:text-white">
              {t("terms")}
            </Link>
            <span aria-hidden>·</span>
            <a href="#hero" className="hover:text-white">
              {t("backToTop")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterBrand({ t }: { t: ReturnType<typeof useTranslations<"footer">> }) {
  return (
    <>
      <div className="text-xl font-semibold">Bao Service</div>
      <p className="mt-3 text-sm text-slate-400">{t("tagline")}</p>
      <div className="mt-4 text-sm text-slate-300">
        {ADDRESS}
        <br />
        {CITY}
      </div>
      <div className="mt-3 text-sm">
        <a href={`mailto:${EMAIL}`} className="hover:underline">
          {EMAIL}
        </a>
        <br />
        <a href={WHATSAPP_BASE} className="hover:underline" target="_blank" rel="noreferrer">
          +65 8511 9195 (WhatsApp)
        </a>
      </div>
    </>
  );
}

function FooterUen() {
  return (
    <div className="mt-4 text-xs text-slate-400">
      UEN / Company Reg. No.: <span className="font-medium">{UEN}</span>
    </div>
  );
}
