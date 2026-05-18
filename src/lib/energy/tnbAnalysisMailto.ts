import { EMAIL } from "@/lib/constants";

export function buildTnbAnalysisMailtoLink(subject: string, body: string): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
