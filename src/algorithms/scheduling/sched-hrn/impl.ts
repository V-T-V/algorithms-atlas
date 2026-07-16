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
export interface HrnHooks {
  onPick?: (j: Job, ratio: number, time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function hrn(jobs: Job[], hooks: HrnHooks = {}): SchedResult {
  const remaining = [...jobs];
  const segments: Segment[] = [];
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
    } else {
      pick = ready.reduce((a, b) => {
        const ra = (time - a.arrival + a.burst) / a.burst;
        const rb = (time - b.arrival + b.burst) / b.burst;
        return ra >= rb ? a : b;
      });
    }
    const ratio = (time - pick.arrival + pick.burst) / pick.burst;
    remaining.splice(remaining.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait;
    totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, ratio, time);
    order.push(pick.id);
    segments.push({ id: pick.id, start: time, end: time + pick.burst });
    time += pick.burst;
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
