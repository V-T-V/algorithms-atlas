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
export interface IrrHooks {
  onRun?: (id: string, start: number, dur: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function interactiveRR(jobs: Job[], quantum: number, hooks: IrrHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const q: Job[] = [...jobs].sort((a, b) => a.arrival - b.arrival);
  let time = 0;
  const segments: Segment[] = [];
  const order: string[] = [];
  const finish = new Map<string, number>();
  let totalWait = 0,
    totalTurn = 0;
  while (q.length) {
    const j = q.shift()!;
    if (j.arrival > time) {
      time = j.arrival;
    }
    const run = Math.min(quantum, rem.get(j.id)!);
    if (!order.includes(j.id)) order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + run });
    hooks.onRun?.(j.id, time, run);
    rem.set(j.id, rem.get(j.id)! - run);
    time += run;
    if (rem.get(j.id) === 0) finish.set(j.id, time);
    else q.push(j);
  }
  for (const job of jobs)
    if (finish.has(job.id)) {
      totalTurn += finish.get(job.id)! - job.arrival;
      totalWait += finish.get(job.id)! - job.arrival - job.burst;
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
