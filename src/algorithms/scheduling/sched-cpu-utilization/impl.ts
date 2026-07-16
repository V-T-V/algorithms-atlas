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
export interface UtilHooks {
  onCalc?: (util: number, idle: number) => void;
  onResult?: (util: number) => void;
}
export function cpuUtilization(jobs: Job[], hooks: UtilHooks = {}): number {
  const sorted = [...jobs].sort((a, b) => a.arrival - b.arrival);
  let time = 0,
    busy = 0;
  for (const j of sorted) {
    if (j.arrival > time) time = j.arrival;
    busy += j.burst;
    time += j.burst;
  }
  const total = time - sorted[0]!.arrival;
  const idle = total - busy;
  const util = total === 0 ? 1 : busy / total;
  hooks.onCalc?.(util, idle);
  hooks.onResult?.(util);
  return util;
}
