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
export interface CscHooks {
  onSwitch?: (from: string, to: string) => void;
  onResult?: (count: number) => void;
}
export function contextSwitchCount(segments: Segment[], hooks: CscHooks = {}): number {
  let count = 0;
  for (let i = 1; i < segments.length; i++) {
    if (segments[i]!.id !== segments[i - 1]!.id) {
      count++;
      hooks.onSwitch?.(segments[i - 1]!.id, segments[i]!.id);
    }
  }
  hooks.onResult?.(count);
  return count;
}
