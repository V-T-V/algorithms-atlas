export interface Job {
  id: string;
  arrival: number;
  burst: number;
  priority?: number;
}
export interface Segment {
  id: string;
  start: number;
  end: number;
}
export interface SchedResult {
  order: string[];
  segments: Segment[];
  avgWait: number;
  avgTurnaround: number;
}
export interface PeriodicJob {
  id: string;
  period: number;
  burst: number;
}
export interface RmHooks {
  onAssign?: (id: string, pri: number) => void;
  onResult?: (util: number) => void;
}
export function rateMonotonic(
  jobs: PeriodicJob[],
  hooks: RmHooks = {},
): Array<{ id: string; priority: number }> {
  const sorted = [...jobs].sort((a, b) => a.period - b.period);
  const out = sorted.map((j, i) => ({ id: j.id, priority: i }));
  const util = jobs.reduce((s, j) => s + j.burst / j.period, 0);
  for (const o of out) hooks.onAssign?.(o.id, o.priority);
  hooks.onResult?.(util);
  return out;
}
