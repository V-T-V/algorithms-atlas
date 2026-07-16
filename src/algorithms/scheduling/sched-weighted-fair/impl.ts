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
export interface WfJob extends Job {
  weight: number;
}
export interface WfqHooks {
  onSend?: (j: WfJob, vt: number) => void;
  onResult?: (order: string[]) => void;
}
export function weightedFairQueue(jobs: WfJob[], hooks: WfqHooks = {}): string[] {
  let vt = 0;
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const order: string[] = [];
  for (const j of sorted) {
    const finish = vt + j.burst / j.weight;
    hooks.onSend?.(j, finish);
    order.push(j.id);
    vt = finish;
  }
  hooks.onResult?.(order);
  return order;
}
