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
export interface LotteryJob extends Job {
  tickets: number;
}
export interface LtHooks {
  onPick?: (j: LotteryJob, time: number) => void;
  onResult?: (r: SchedResult) => void;
}
export function lottery(jobs: LotteryJob[], hooks: LtHooks = {}, seed = 42): SchedResult {
  let rand = seed;
  const next = () => {
    rand = (rand * 1103515245 + 12345) & 0x7fffffff;
    return rand;
  };
  const remaining = [...jobs];
  const segments: Segment[] = [];
  const order: string[] = [];
  let time = 0,
    totalWait = 0,
    totalTurn = 0;
  while (remaining.length) {
    const ready = remaining.filter((j) => j.arrival <= time);
    if (ready.length === 0) {
      time = Math.min(...remaining.map((j) => j.arrival));
      continue;
    }
    const total = ready.reduce((s, j) => s + j.tickets, 0);
    let draw = next() % total;
    let pick = ready[0]!;
    for (const j of ready) {
      draw -= j.tickets;
      if (draw < 0) {
        pick = j;
        break;
      }
    }
    remaining.splice(remaining.indexOf(pick), 1);
    const wait = Math.max(0, time - pick.arrival);
    totalWait += wait;
    totalTurn += wait + pick.burst;
    hooks.onPick?.(pick, time);
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
