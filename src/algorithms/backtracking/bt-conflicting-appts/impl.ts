export interface Appt {
  start: number;
  end: number;
}
export interface CaHooks {
  onPick?: (i: number) => void;
  onResult?: (max: number) => void;
}
export function maxNonConflict(appts: Appt[], hooks: CaHooks = {}): number {
  const sorted = [...appts].sort((a, b) => a.end - b.end);
  let best = 0;
  const go = (i: number, lastEnd: number, count: number) => {
    if (i === sorted.length) {
      best = Math.max(best, count);
      return;
    }
    if (sorted[i]!.start >= lastEnd) {
      hooks.onPick?.(i);
      go(i + 1, sorted[i]!.end, count + 1);
    }
    go(i + 1, lastEnd, count);
  };
  go(0, -Infinity, 0);
  hooks.onResult?.(best);
  return best;
}
