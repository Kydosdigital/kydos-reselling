export function analyticsDate(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function daysSince(value: unknown, now = new Date()) {
  const date = analyticsDate(value);
  if (!date) return null;
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86400000));
}

export function completionPercent(completed: number, total: number) {
  if (!Number.isFinite(total) || total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((Math.max(0, completed) / total) * 100)));
}

export function isRecentlyActive(value: unknown, days: number, now = new Date()) {
  const age = daysSince(value, now);
  return age !== null && age <= days;
}

export function isLearningStalled(input: {
  progressPercent: number;
  programmeStart: unknown;
  latestLearningAt: unknown;
  now?: Date;
  thresholdDays?: number;
}) {
  if (input.progressPercent >= 100) return false;
  const now = input.now || new Date();
  const threshold = input.thresholdDays ?? 14;
  const programmeAge = daysSince(input.programmeStart, now);
  if (programmeAge === null || programmeAge < threshold) return false;
  const learningAge = daysSince(input.latestLearningAt, now);
  return learningAge === null || learningAge >= threshold;
}
