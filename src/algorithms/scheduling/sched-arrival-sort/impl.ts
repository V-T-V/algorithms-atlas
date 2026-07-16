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
export interface AsHooks {
  onRun?: (j: Job, time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function arrivalSortSchedule(jobs: Job[], hooks: AsHooks = {}): SchedResult {
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = [];
  const order: string[] = [];
  let time = 0,
    totalWait = 0,
    totalTurn = 0;
  for (const j of sorted) {
    if (j.arrival > time) time = j.arrival;
    const wait = time - j.arrival;
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
