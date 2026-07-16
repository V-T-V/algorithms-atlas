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
export interface FcOhHooks {
  onPick?: (j: Job, time: number) => void;
  onSwitch?: (time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function fcfsOverhead(jobs: Job[], overhead: number, hooks: FcOhHooks = {}): SchedResult {
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = [];
  const order: string[] = [];
  let time = 0,
    totalWait = 0,
    totalTurn = 0;
  for (let i = 0; i < sorted.length; i++) {
    const j = sorted[i]!;
    if (j.arrival > time) time = j.arrival;
    if (i > 0) {
      hooks.onSwitch?.(time);
      time += overhead;
    }
    const wait = Math.max(0, time - j.arrival);
    totalWait += wait;
    totalTurn += wait + j.burst;
    hooks.onPick?.(j, time);
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
