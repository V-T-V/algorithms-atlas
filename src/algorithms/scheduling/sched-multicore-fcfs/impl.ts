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
export interface McHooks {
  onAssign?: (j: Job, core: number, start: number) => void;
  onResult?: (loads: number[]) => void;
}
export function multicoreFCFS(jobs: Job[], cores: number, hooks: McHooks = {}): number[] {
  const avail = new Array(cores).fill(0);
  for (const j of [...jobs].sort((a, b) => a.arrival - b.arrival)) {
    let c = 0;
    for (let i = 1; i < cores; i++) if (avail[i]! < avail[c]!) c = i;
    const start = Math.max(avail[c]!, j.arrival);
    hooks.onAssign?.(j, c, start);
    avail[c] = start + j.burst;
  }
  hooks.onResult?.(avail);
  return avail;
}
