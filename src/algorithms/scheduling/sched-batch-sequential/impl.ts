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
export interface BsHooks {
  onRun?: (j: Job, start: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function batchSequential(jobs: Job[], hooks: BsHooks = {}): SchedResult {
  const segments: Segment[] = [];
  const order: string[] = [];
  let time = 0,
    totalWait = 0,
    totalTurn = 0;
  for (const j of jobs) {
    const wait = Math.max(0, time - j.arrival);
    totalWait += wait;
    totalTurn += wait + j.burst;
    hooks.onRun?.(j, time);
    order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + j.burst });
    time += j.burst;
  }
  const r = {
    order,
    segments,
    avgWait: totalWait / jobs.length,
    avgTurnaround: totalTurn / jobs.length,
  };
  hooks.onResult?.(r);
  return r;
}
