import type { Tables } from "@/integrations/supabase/types";

export type CourseLesson = Tables<"course_lessons">;
export type CourseSubmission = Tables<"course_submissions">;
export type CourseInvite = Tables<"course_invites">;
export type SubmissionStatus = "pending" | "approved" | "revision";

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  pending: "На проверке",
  approved: "Принято",
  revision: "Нужна доработка",
};

export function safeFileName(name: string) {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase().replace(/[^.a-z0-9]/g, "") : "";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
}

export const COURSES = [["otnosheniya", "Раппóрт — Отношения"], ["zhivaya", "Раппóрт — Живая"], ["beauty", "Раппóрт Beauty"], ["business", "Раппóрт Бизнес"]] as const;
export type CourseKey = (typeof COURSES)[number][0];
export const courseLabel = (k: string) => COURSES.find(([c]) => c === k)?.[1] ?? k;
