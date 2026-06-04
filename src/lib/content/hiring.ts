export const hiringFaqKeys = [
  "faq1",
  "faq2",
  "faq3",
  "faq4",
  "faq5",
  "faq6",
] as const;

export type HiringFaqKey = (typeof hiringFaqKeys)[number];

export const hiringTimelineKeys = ["step1", "step2", "step3", "step4"] as const;

export const studyCardIds = ["electrical", "energy", "pm"] as const;

export type StudyCardId = (typeof studyCardIds)[number];

export type StudiedSolutionKey = StudyCardId;

export const hiringStudyLinks: {
  key: StudiedSolutionKey;
  href: (locale: string) => string;
}[] = [
  { key: "electrical", href: (locale) => `/${locale}?source=hiring-study-electrical` },
  { key: "energy", href: (locale) => `/${locale}/energy-efficient?source=hiring-study-energy` },
  { key: "pm", href: (locale) => `/${locale}/project-management?source=hiring-study-pm` },
];
