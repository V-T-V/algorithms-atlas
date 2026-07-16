// =============================================================================
// 超级洗衣机 · 纯算法实现
// =============================================================================

export interface SuperWashHooks {
  onStep?: (i: number, gain: number, flow: number, curMax: number) => void;
  onDone?: (rounds: number) => void;
}

export function superWashingMachines(
  machines: readonly number[],
  hooks: SuperWashHooks = {},
): number {
  const n = machines.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let total = 0;
  for (const x of machines) total += x;
  if (total % n !== 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  const avg = total / n;
  let flow = 0;
  let ans = 0;
  for (let i = 0; i < n; i++) {
    const gain = machines[i]! - avg;
    flow += gain;
    const cur = Math.max(Math.abs(flow), gain);
    if (cur > ans) ans = cur;
    hooks.onStep?.(i, gain, flow, ans);
  }
  hooks.onDone?.(ans);
  return ans;
}
