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
export interface GanttHooks {
  onCell?: (time: number, id: string) => void;
  onResult?: (chart: string) => void;
}
export function buildGantt(segments: Segment[], hooks: GanttHooks = {}): string {
  const total = segments.reduce((m, s) => Math.max(m, s.end), 0);
  let chart = '';
  for (let t = 0; t < total; t++) {
    const s = segments.find((x) => t >= x.start && t < x.end);
    const id = s ? s.id : '_';
    chart += id;
    hooks.onCell?.(t, id);
  }
  hooks.onResult?.(chart);
  return chart;
}
