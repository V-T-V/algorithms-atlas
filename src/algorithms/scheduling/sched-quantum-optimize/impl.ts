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
export interface QoHooks {
  onTry?: (q: number, avgWait: number) => void;
  onResult?: (best: { quantum: number; avgWait: number }) => void;
}
function rrOnce(jobs: Job[], quantum: number): number {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const q = [...jobs].sort((a, b) => a.arrival - b.arrival);
  let time = 0,
    totalWait = 0;
  const finish = new Map<string, number>();
  while (q.length) {
    const j = q.shift()!;
    if (j.arrival > time) time = j.arrival;
    const run = Math.min(quantum, rem.get(j.id)!);
    rem.set(j.id, rem.get(j.id)! - run);
    time += run;
    if (rem.get(j.id) === 0) finish.set(j.id, time);
    else q.push(j);
  }
  for (const job of jobs) totalWait += finish.get(job.id)! - job.arrival - job.burst;
  return totalWait / jobs.length;
}
export function optimizeQuantum(
  jobs: Job[],
  hooks: QoHooks = {},
): { quantum: number; avgWait: number } {
  const maxBurst = Math.max(...jobs.map((j) => j.burst));
  let best = { quantum: 1, avgWait: Infinity };
  for (let q = 1; q <= maxBurst; q++) {
    const aw = rrOnce(jobs, q);
    hooks.onTry?.(q, aw);
    if (aw < best.avgWait) best = { quantum: q, avgWait: aw };
  }
  hooks.onResult?.(best);
  return best;
}
