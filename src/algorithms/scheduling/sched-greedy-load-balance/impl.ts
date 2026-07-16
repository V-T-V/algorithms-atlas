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
export interface LbHooks {
  onAssign?: (j: Job, machine: number) => void;
  onResult?: (loads: number[]) => void;
}
export function lptLoadBalance(jobs: Job[], machines: number, hooks: LbHooks = {}): number[] {
  const loads = new Array(machines).fill(0);
  const sorted = [...jobs].sort((a, b) => b.burst - a.burst);
  for (const j of sorted) {
    let mi = 0;
    for (let i = 1; i < machines; i++) if (loads[i]! < loads[mi]!) mi = i;
    hooks.onAssign?.(j, mi);
    loads[mi] += j.burst;
  }
  hooks.onResult?.(loads);
  return loads;
}
