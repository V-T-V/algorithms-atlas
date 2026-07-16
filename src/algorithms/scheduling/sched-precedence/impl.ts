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
export interface PrecTask extends Job {
  deps: string[];
}
export interface PcHooks {
  onRun?: (j: PrecTask, time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function precedenceSchedule(tasks: PrecTask[], hooks: PcHooks = {}): SchedResult {
  const indeg = new Map(tasks.map((t) => [t.id, 0]));
  const adj = new Map(tasks.map((t) => [t.id, [] as string[]]));
  for (const t of tasks)
    for (const d of t.deps) {
      adj.get(d)!.push(t.id);
      indeg.set(t.id, (indeg.get(t.id) ?? 0) + 1);
    }
  const q: string[] = [];
  for (const [id, d] of indeg) if (d === 0) q.push(id);
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const segments: Segment[] = [];
  const order: string[] = [];
  let time = 0,
    totalWait = 0,
    totalTurn = 0;
  while (q.length) {
    const id = q.shift()!;
    const j = byId.get(id)!;
    const wait = Math.max(0, time - j.arrival);
    totalWait += wait;
    totalTurn += wait + j.burst;
    hooks.onRun?.(j, time);
    order.push(id);
    segments.push({ id, start: time, end: time + j.burst });
    time += j.burst;
    for (const v of adj.get(id) ?? []) {
      indeg.set(v, (indeg.get(v) ?? 0) - 1);
      if (indeg.get(v) === 0) q.push(v);
    }
  }
  const r = {
    order,
    segments,
    avgWait: totalWait / tasks.length,
    avgTurnaround: totalTurn / tasks.length,
  };
  hooks.onResult?.(r);
  return r;
}
