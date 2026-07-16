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
export interface RrHooks {
  onRun?: (id: string, start: number, dur: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function roundRobin(jobs: Job[], quantum: number, hooks: RrHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const q: Job[] = [...jobs].sort((a, b) => a.arrival - b.arrival);
  let time = 0,
    i = 0;
  const segments: Segment[] = [];
  const order: string[] = [];
  const finish = new Map<string, number>();
  let totalWait = 0,
    totalTurn = 0;
  while (q.length) {
    if (i >= q.length) {
      i = 0;
      if (q.every((j) => j.arrival > time)) time = Math.min(...q.map((j) => j.arrival));
    }
    const j = q[i]!;
    if (j.arrival > time) {
      i++;
      continue;
    }
    const run = Math.min(quantum, rem.get(j.id)!);
    if (!order.includes(j.id)) order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + run });
    hooks.onRun?.(j.id, time, run);
    rem.set(j.id, rem.get(j.id)! - run);
    time += run;
    i++;
    if (rem.get(j.id) === 0) {
      q.splice(q.indexOf(j), 1);
      finish.set(j.id, time);
      i--;
    }
  }
  for (const job of jobs) {
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
