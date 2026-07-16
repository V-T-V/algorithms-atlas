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
export interface RtJob extends Job {
  deadline: number;
}
export interface EdfHooks {
  onTick?: (id: string, time: number) => void;
  onResult?: (r: SchedResult, missed: number) => void;
}
export function edf(jobs: RtJob[], hooks: EdfHooks = {}): { result: SchedResult; missed: number } {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const done = new Set<string>();
  const segments: Segment[] = [];
  const order: string[] = [];
  const finish = new Map<string, number>();
  let time = 0,
    missed = 0;
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) {
      time++;
      continue;
    }
    const pick = ready.reduce((a, b) => (a.deadline < b.deadline ? a : b));
    if (segments.length === 0 || segments[segments.length - 1]!.id !== pick.id) {
      segments.push({ id: pick.id, start: time, end: time + 1 });
      if (!order.includes(pick.id)) order.push(pick.id);
    } else segments[segments.length - 1]!.end = time + 1;
    hooks.onTick?.(pick.id, time);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) {
      done.add(pick.id);
      finish.set(pick.id, time);
      if (time > pick.deadline) missed++;
    }
  }
  let totalWait = 0,
    totalTurn = 0;
  for (const j of jobs) {
    totalTurn += finish.get(j.id)! - j.arrival;
    totalWait += finish.get(j.id)! - j.arrival - j.burst;
  }
  const r = {
    order,
    segments,
    avgWait: totalWait / jobs.length,
    avgTurnaround: totalTurn / jobs.length,
  };
  hooks.onResult?.(r, missed);
  return { result: r, missed };
}
