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
export interface Rr2Hooks {
  onRatio?: (id: string, ratio: number) => void;
  onResult?: (ratios: Map<string, number>) => void;
}
export function responseRatios(
  jobs: Job[],
  time: number,
  hooks: Rr2Hooks = {},
): Map<string, number> {
  const out = new Map<string, number>();
  for (const j of jobs) {
    const wait = Math.max(0, time - j.arrival);
    const r = (wait + j.burst) / j.burst;
    out.set(j.id, r);
    hooks.onRatio?.(j.id, r);
  }
  hooks.onResult?.(out);
  return out;
}
