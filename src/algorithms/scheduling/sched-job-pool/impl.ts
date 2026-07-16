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
export type Policy = (a: Job, b: Job) => number;
export const Policies: Record<string, Policy> = {
  fcfs: (a, b) => a.arrival - b.arrival,
  sjf: (a, b) => a.burst - b.burst,
  priority: (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
};
export interface JpHooks {
  onPick?: (j: Job, time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function jobPool(jobs: Job[], policy: Policy, hooks: JpHooks = {}): SchedResult {
  const rem = [...jobs];
  const segments: Segment[] = [];
  const order: string[] = [];
  let time = 0,
    totalWait = 0,
    totalTurn = 0;
  while (rem.length) {
    const ready = rem.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) {
      pick = rem.reduce((a, b) => (a.arrival < b.arrival ? a : b));
      time = pick.arrival;
    } else pick = ready.reduce((a, b) => (policy(a, b) <= 0 ? a : b));
    rem.splice(rem.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait;
    totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
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
