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
export interface ThHooks {
  onResult?: (throughput: number) => void;
}
export function throughput(jobs: Job[], totalTime: number, hooks: ThHooks = {}): number {
  const t = totalTime === 0 ? 0 : jobs.length / totalTime;
  hooks.onResult?.(t);
  return t;
}
