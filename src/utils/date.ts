export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Number of calendar days between "now" and a date-only ISO string
 * (e.g. a course's startDate), rounded to whole days. Positive = in the
 * future, 0 = today, negative = already past.
 *
 * A plain "yyyy-mm-dd" string is parsed by `Date` as UTC midnight, so `now`
 * is anchored to UTC midnight of its own local calendar date before
 * diffing — this keeps the day count based on calendar dates rather than
 * exact 24h periods, so "starts in 3 days" doesn't drift depending on the
 * time of day the dashboard happens to be viewed.
 */
export function daysUntilStart(startDateIso: string, now: Date = new Date()): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const startUtcMidnight = new Date(startDateIso).getTime();
  const nowUtcMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((startUtcMidnight - nowUtcMidnight) / msPerDay);
}
