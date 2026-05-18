/** Demo monitoring dashboard — distinct from marketing slate/brand panels */

export const demoDashboardTheme = {
  shell: "bg-[#0a101f] text-slate-100",
  header:
    "bg-gradient-to-r from-[#134e4a] via-[#1e3a5f] to-[#0f2744] border-b border-teal-400/20",
  body: "bg-[#0f1629]",
  card: "bg-[#162038] ring-1 ring-inset ring-white/[0.06]",
  cardMuted: "bg-[#1a2640] ring-1 ring-inset ring-white/[0.05]",
  tabBar: "bg-[#121c32] ring-1 ring-inset ring-white/[0.06]",
  tabActive: "bg-teal-600 text-white shadow-sm shadow-teal-900/40",
  tabIdle: "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]",
  select:
    "bg-[#121c32] text-slate-100 ring-1 ring-inset ring-teal-500/25 rounded-lg focus:ring-teal-500/50",
  chartBar: "#2dd4bf",
  chartBarAlt: "#64748b",
  chartTrack: "bg-[#121c32]",
  accent: "text-teal-300",
  accentBg: "bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/30",
  label: "text-slate-400",
  live: "bg-emerald-400",
} as const;
