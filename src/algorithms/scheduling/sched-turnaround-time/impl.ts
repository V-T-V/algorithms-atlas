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
export interface TatHooks {
  onCalc?: (id: string, tat: number) => void;
  onResult?: (avg: number) => void;
}
export function turnaroundTimes(
  jobs: Job[],
  finish: Map<string, number>,
  hooks: TatHooks = {},
): Map<string, number> {
  const out = new Map<string, number>();
  let sum = 0;
  for (const j of jobs) {
    const tat = (finish.get(j.id) ?? j.arrival + j.burst) - j.arrival;
    out.set(j.id, tat);
    sum += tat;
    hooks.onCalc?.(j.id, tat);
  }
  const avg = sum / jobs.length;
  hooks.onResult?.(avg);
  return out;
}
