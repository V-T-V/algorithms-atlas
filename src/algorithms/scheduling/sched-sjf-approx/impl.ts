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
export interface EaJob {
  id: string;
  bursts: number[];
}
export interface Ea2Hooks {
  onEstimate?: (id: string, est: number) => void;
  onResult?: (ests: Map<string, number>) => void;
}
export function exponentialAveraging(
  jobs: EaJob[],
  alpha: number,
  hooks: Ea2Hooks = {},
): Map<string, number> {
  const est = new Map<string, number>();
  for (const j of jobs) {
    let t = j.bursts[0] ?? 1;
    for (let i = 1; i < j.bursts.length; i++) t = alpha * j.bursts[i]! + (1 - alpha) * t;
    est.set(j.id, t);
    hooks.onEstimate?.(j.id, t);
  }
  hooks.onResult?.(est);
  return est;
}
