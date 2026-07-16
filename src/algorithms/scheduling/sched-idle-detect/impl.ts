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
export interface Idle {
  start: number;
  end: number;
}
export interface IdHooks {
  onIdle?: (i: Idle) => void;
  onResult?: (idles: Idle[]) => void;
}
export function detectIdle(segments: Segment[], total: number, hooks: IdHooks = {}): Idle[] {
  const sorted = [...segments].sort((a, b) => a.start - b.start);
  const idles: Idle[] = [];
  let t = 0;
  for (const s of sorted) {
    if (s.start > t) {
      const i = { start: t, end: s.start };
      idles.push(i);
      hooks.onIdle?.(i);
    }
    t = Math.max(t, s.end);
  }
  if (t < total) {
    const i = { start: t, end: total };
    idles.push(i);
    hooks.onIdle?.(i);
  }
  hooks.onResult?.(idles);
  return idles;
}
