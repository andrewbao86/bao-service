/**
 * Color & surface conventions:
 * - Neutrals: slate tokens only on marketing UI
 * - Primary CTAs: Button default / brand-600
 * - WhatsApp: Button whatsapp / bg-whatsapp
 * - Section rhythm: white ↔ section-alt ↔ surface-dark
 * - Hero gradient: from-brand-600 via-brand-500 to-slate-800
 */

export const text = {
  heading: "text-slate-900",
  body: "text-slate-600",
  muted: "text-slate-500",
  onDark: "text-slate-100",
  onDarkMuted: "text-slate-300",
} as const;

export const section = {
  default: "bg-white",
  alt: "bg-section-alt",
  dark: "bg-surface-dark text-white",
  darker: "bg-surface-darker text-slate-200",
} as const;

export const heroGradient = "bg-gradient-to-b from-brand-600 via-brand-500 to-slate-800";

/** Shared surfaces — soft elevation instead of heavy solid borders */
export const surface = {
  card: "bg-white rounded-xl shadow-sm ring-1 ring-slate-900/[0.06]",
  cardHover: "hover:shadow-md hover:ring-slate-900/[0.08] transition-all duration-300",
  cardMuted: "bg-slate-50 rounded-xl shadow-sm ring-1 ring-slate-900/[0.04]",
  panel: "bg-white rounded-xl shadow-md ring-1 ring-slate-900/[0.05]",
  inset: "bg-slate-50/90 rounded-lg ring-1 ring-slate-900/[0.04]",
  darkInset: "bg-slate-800 rounded-lg ring-1 ring-inset ring-white/10",
  divider: "border-t border-slate-200/70",
  dividerSubtle: "border-b border-slate-200/60",
} as const;
