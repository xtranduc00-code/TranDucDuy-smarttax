export interface EnrollmentProgress {
  percent: number;
  met: boolean;
}

/**
 * Shared "current / minimum students" math, used everywhere enrollment
 * progress is displayed (course tables, dashboard) so the percentage and
 * "target met" logic is calculated in exactly one place.
 */
export function calculateEnrollmentProgress(current: number, minimum: number): EnrollmentProgress {
  const percent = minimum > 0 ? Math.min(100, Math.round((current / minimum) * 100)) : 100;
  return { percent, met: current >= minimum };
}
