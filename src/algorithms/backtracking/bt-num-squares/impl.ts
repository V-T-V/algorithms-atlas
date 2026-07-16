export interface NsHooks {
  onTry?: (sq: number, cnt: number) => void;
  onResult?: (min: number) => void;
}
export function numSquares(n: number, hooks: NsHooks = {}): number {
  let best = Infinity;
  const go = (remain: number, cnt: number, maxSq: number) => {
    if (cnt >= best) return;
    if (remain === 0) {
      best = Math.min(best, cnt);
      return;
    }
    for (let k = Math.min(maxSq, Math.floor(Math.sqrt(remain))); k >= 1; k--) {
      const sq = k * k;
      hooks.onTry?.(sq, cnt + 1);
      go(remain - sq, cnt + 1, k);
    }
  };
  go(n, 0, Math.floor(Math.sqrt(n)));
  hooks.onResult?.(best);
  return best;
}
