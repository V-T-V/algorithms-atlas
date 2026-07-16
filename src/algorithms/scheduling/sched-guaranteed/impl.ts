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
export interface FsJob extends Job {
  group: string;
}
export interface FsHooks {
  onPick?: (j: FsJob, time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function fairShare(jobs: FsJob[], hooks: FsHooks = {}): SchedResult {
  const groups = new Map<string, FsJob[]>();
  for (const j of jobs) {
    if (!groups.has(j.group)) groups.set(j.group, []);
    groups.get(j.group)!.push(j);
  }
  const segs: Segment[] = [];
  const order: string[] = [];
  let time = 0,
    totalWait = 0,
    totalTurn = 0;
  while ([...groups.values()].some((g) => g.length)) {
    for (const [, list] of [...groups.entries()].sort()) {
      if (!list.length) continue;
      const j = list.shift()!;
      const wait = Math.max(0, time - j.arrival);
      totalWait += wait;
      totalTurn += wait + j.burst;
      hooks.onPick?.(j, time);
      order.push(j.id);
      segs.push({ id: j.id, start: time, end: time + j.burst });
      time += j.burst;
    }
  }
  const r = {
    order,
    segments: segs,
    avgWait: totalWait / jobs.length,
    avgTurnaround: totalTurn / jobs.length,
  };
  hooks.onResult?.(r);
  return r;
}
