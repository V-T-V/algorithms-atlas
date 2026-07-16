// =============================================================================
// 栅栏涂色
// =============================================================================

export interface PaintFenceHooks {
  onStep?: (i: number, same: number, diff: number, total: number) => void;
  onDone?: (ways: number) => void;
}

export function numWaysPaintFence(n: number, k: number, hooks: PaintFenceHooks = {}): number {
  if (n === 0) return 0;
  if (n === 1) return k;
  let same = k;
  let diff = k * (k - 1);
  for (let i = 3; i <= n; i++) {
    const prevSame = same;
    same = diff;
    diff = (prevSame + diff) * (k - 1);
    hooks.onStep?.(i, same, diff, same + diff);
  }
  const ans = same + diff;
  hooks.onDone?.(ans);
  return ans;
}
