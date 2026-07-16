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
export interface LlfJob extends Job {
  deadline: number;
}
export interface LlfHooks {
  onTick?: (id: string, lax: number) => void;
  onResult?: (r: { order: string[]; missed: number }) => void;
}
export function llf(jobs: LlfJob[], hooks: LlfHooks = {}): { order: string[]; missed: number } {
  const rem = new Map(jobs.map((j) => [j.id, j.burst]));
  const done = new Set<string>();
  const order: string[] = [];
  let time = 0,
    missed = 0;
  while (done.size < jobs.length) {
    const ready = jobs.filter((j) => j.arrival <= time && !done.has(j.id));
    if (ready.length === 0) {
      time++;
      continue;
    }
    const pick = ready.reduce((a, b) => {
      const la = a.deadline - time - rem.get(a.id)!;
      const lb = b.deadline - time - rem.get(b.id)!;
      return la <= lb ? a : b;
    });
    const lax = pick.deadline - time - rem.get(pick.id)!;
    if (!order.includes(pick.id) || order[order.length - 1] !== pick.id) order.push(pick.id);
    hooks.onTick?.(pick.id, lax);
    rem.set(pick.id, rem.get(pick.id)! - 1);
    time++;
    if (rem.get(pick.id) === 0) {
      done.add(pick.id);
      if (time > pick.deadline) missed++;
    }
  }
  hooks.onResult?.({ order, missed });
  return { order, missed };
}
