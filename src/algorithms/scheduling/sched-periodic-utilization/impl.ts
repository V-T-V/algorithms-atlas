export interface PuHooks {
  onResult?: (util: number, bound: number, schedulable: boolean) => void;
}
export function periodicUtilization(
  jobs: Array<{ id: string; period: number; burst: number }>,
  hooks: PuHooks = {},
): { util: number; bound: number; schedulable: boolean } {
  const n = jobs.length;
  const util = jobs.reduce((s, j) => s + j.burst / j.period, 0);
  const bound = n * (Math.pow(2, 1 / n) - 1);
  const schedulable = util <= bound;
  hooks.onResult?.(util, bound, schedulable);
  return { util, bound, schedulable };
}
