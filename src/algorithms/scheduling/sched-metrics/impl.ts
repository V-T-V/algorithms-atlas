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
export interface MetricResult {
  id: string;
  wait: number;
  turnaround: number;
  response: number;
}
export interface MtrHooks {
  onMetric?: (m: MetricResult) => void;
  onResult?: (avg: { wait: number; turnaround: number; response: number }) => void;
}
export function computeMetrics(
  jobs: Job[],
  segments: Segment[],
  hooks: MtrHooks = {},
): MetricResult[] {
  const firstRun = new Map<string, number>();
  const finish = new Map<string, number>();
  for (const s of segments) {
    if (!firstRun.has(s.id)) firstRun.set(s.id, s.start);
    finish.set(s.id, Math.max(finish.get(s.id) ?? 0, s.end));
  }
  const out: MetricResult[] = [];
  for (const j of jobs) {
    const fr = firstRun.get(j.id) ?? j.arrival;
    const fin = finish.get(j.id) ?? j.arrival + j.burst;
    const m = {
      id: j.id,
      wait: fin - j.arrival - j.burst,
      turnaround: fin - j.arrival,
      response: fr - j.arrival,
    };
    out.push(m);
    hooks.onMetric?.(m);
  }
  const n = jobs.length;
  const avg = {
    wait: out.reduce((s, m) => s + m.wait, 0) / n,
    turnaround: out.reduce((s, m) => s + m.turnaround, 0) / n,
    response: out.reduce((s, m) => s + m.response, 0) / n,
  };
  hooks.onResult?.(avg);
  return out;
}
