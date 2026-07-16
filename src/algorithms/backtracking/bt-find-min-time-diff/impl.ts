export interface MtHooks {
  onPerm?: (p: number[]) => void;
  onResult?: (min: number) => void;
}
function toMin(t: string): number {
  return Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
}
export function findMinDifference(timePoints: string[], hooks: MtHooks = {}): number {
  const mins = timePoints.map(toMin).sort((a, b) => a - b);
  let min = Infinity;
  for (let i = 0; i < mins.length; i++) {
    const a = mins[i]!,
      b = mins[(i + 1) % mins.length]!;
    const diff = Math.min(Math.abs(a - b), 1440 - Math.abs(a - b));
    hooks.onPerm?.([a, b]);
    min = Math.min(min, diff);
  }
  hooks.onResult?.(min);
  return min;
}
