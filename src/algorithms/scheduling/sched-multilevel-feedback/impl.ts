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
export interface MlfqHooks {
  onRun?: (id: string, level: number, start: number, dur: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function mlfq(jobs: Job[], quantums: number[], hooks: MlfqHooks = {}): SchedResult {
  const levels = quantums.length;
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const queues: Job[][] = Array.from({ length: levels }, () => []);
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = [];
  const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0,
    pending = sorted;
  let totalWait = 0,
    totalTurn = 0;
  const arrived = (t: number) => {
    const nw = pending.filter((j) => j.arrival <= t);
    pending = pending.filter((j) => j.arrival > t);
    if (nw.length) queues[0]!.push(...nw);
  };
  while (rem.size) {
    arrived(time);
    let lvl = -1;
    for (let i = 0; i < levels; i++)
      if (queues[i]!.length) {
        lvl = i;
        break;
      }
    if (lvl === -1) {
      if (pending.length) time = pending[0]!.arrival;
      else break;
      continue;
    }
    const j = queues[lvl]!.shift()!;
    const q = quantums[lvl]!;
    const run = Math.min(q, rem.get(j.id)!);
    if (!order.includes(j.id)) order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + run });
    hooks.onRun?.(j.id, lvl, time, run);
    rem.set(j.id, rem.get(j.id)! - run);
    time += run;
    arrived(time);
    if (rem.get(j.id) === 0) {
      finish.set(j.id, time);
      rem.delete(j.id);
    } else if (lvl + 1 < levels) queues[lvl + 1]!.push(j);
    else queues[lvl]!.push(j);
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
