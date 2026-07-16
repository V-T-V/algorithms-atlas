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
export interface IoJob extends Job {
  ioAt: number;
  ioDur: number;
}
export interface VrrHooks {
  onRun?: (id: string, queue: string, time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function virtualRR(jobs: IoJob[], quantum: number, hooks: VrrHooks = {}): SchedResult {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const mainQ: IoJob[] = [];
  const auxQ: IoJob[] = [];
  const blocked: Array<{ j: IoJob; until: number }> = [];
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  const segments: Segment[] = [];
  const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0,
    mi = 0;
  while (rem.size) {
    while (mi < sorted.length && sorted[mi]!.arrival <= time) {
      mainQ.push(sorted[mi]!);
      mi++;
    }
    for (let b = blocked.length - 1; b >= 0; b--)
      if (blocked[b]!.until <= time) {
        auxQ.push(blocked[b]!.j);
        blocked.splice(b, 1);
      }
    const j: IoJob | undefined = auxQ.shift() ?? mainQ.shift();
    if (!j) {
      const next = Math.min(
        ...sorted.slice(mi).map((x) => x.arrival),
        ...blocked.map((b) => b.until),
      );
      time = next;
      continue;
    }
    const q = Math.min(quantum, rem.get(j.id)!);
    if (!order.includes(j.id)) order.push(j.id);
    segments.push({ id: j.id, start: time, end: time + q });
    hooks.onRun?.(j.id, auxQ.includes(j) ? 'aux' : 'main', time);
    rem.set(j.id, rem.get(j.id)! - q);
    time += q;
    if (j.ioAt > 0 && j.ioAt === j.burst - rem.get(j.id)! && rem.get(j.id)! > 0) {
      blocked.push({ j, until: time + j.ioDur });
    } else if (rem.get(j.id) === 0) {
      finish.set(j.id, time);
      rem.delete(j.id);
    } else mainQ.push(j);
  }
  let totalWait = 0,
    totalTurn = 0;
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
