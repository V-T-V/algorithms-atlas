// =============================================================================
// 超级洗衣机 · 纯算法实现
// =============================================================================
export interface SuperWashHooks {
  onMachine?: (i: number, gain: number, ans: number) => void;
  onDone?: (steps: number) => void;
}

export function findMinMoves(machines: readonly number[], hooks: SuperWashHooks = {}): number {
  const sum = machines.reduce((a, b) => a + b, 0);
  const n = machines.length;
  if (sum % n !== 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  const target = sum / n;
  let ans = 0,
    balance = 0;
  for (let i = 0; i < n; i++) {
    const diff = machines[i]! - target;
    balance += diff;
    hooks.onMachine?.(i, balance, Math.max(ans, Math.abs(balance), diff));
    ans = Math.max(ans, Math.abs(balance), diff);
  }
  hooks.onDone?.(ans);
  return ans;
}
