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
export interface AgeHooks {
  onPick?: (j: Job, effPri: number, time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function priorityWithAging(
  jobs: Job[],
  agingRate: number,
  hooks: AgeHooks = {},
): SchedResult {
  const remaining = [...jobs];
  const segs: Segment[] = [];
  const order: string[] = [];
  let time = 0,
    totalWait = 0,
    totalTurn = 0;
  while (remaining.length) {
    const ready = remaining.filter((j) => j.arrival <= time);
    let pick: Job;
    if (ready.length === 0) {
      pick = remaining.reduce((a, b) => (a.arrival < b.arrival ? a : b));
      time = pick.arrival;
    } else
      pick = ready.reduce((a, b) => {
        const ea = (a.priority ?? 0) - Math.max(0, time - a.arrival) / agingRate;
        const eb = (b.priority ?? 0) - Math.max(0, time - b.arrival) / agingRate;
        return ea <= eb ? a : b;
      });
    const eff = (pick.priority ?? 0) - Math.max(0, time - pick.arrival) / agingRate;
    remaining.splice(remaining.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait;
    totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, eff, time);
    order.push(pick.id);
    segs.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
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
