export interface TwHooks {
  onPick?: (v: number) => void;
  onImprove?: (diff: number) => void;
  onResult?: (diff: number) => void;
}
export function tugOfWar(arr: number[], hooks: TwHooks = {}): number {
  const total = arr.reduce((a, b) => a + b, 0);
  const half = Math.floor(arr.length / 2);
  let best = Infinity;
  let curSum = 0,
    curCount = 0;
  const go = (i: number) => {
    if (curCount === half) {
      const diff = Math.abs(total - 2 * curSum);
      if (diff < best) {
        best = diff;
        hooks.onImprove?.(diff);
      }
      return;
    }
    if (i === arr.length) return;
    if (curCount < half) {
      curSum += arr[i]!;
      curCount++;
      hooks.onPick?.(arr[i]!);
      go(i + 1);
      curSum -= arr[i]!;
      curCount--;
    }
    go(i + 1);
  };
  go(0);
  hooks.onResult?.(best);
  return best;
}
