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
export interface WtHooks {
  onCalc?: (id: string, wait: number) => void;
  onResult?: (avg: number) => void;
}
export function waitingTimes(
  jobs: Job[],
  turnaround: Map<string, number>,
  hooks: WtHooks = {},
): Map<string, number> {
  const out = new Map<string, number>();
  let sum = 0;
  for (const j of jobs) {
    const w = (turnaround.get(j.id) ?? j.burst) - j.burst;
    out.set(j.id, w);
    sum += w;
    hooks.onCalc?.(j.id, w);
  }
  const avg = sum / jobs.length;
  hooks.onResult?.(avg);
  return out;
}
