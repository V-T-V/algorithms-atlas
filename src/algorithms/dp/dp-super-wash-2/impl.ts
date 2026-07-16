// =============================================================================
// 超级洗衣机 · 贪心
// =============================================================================

export interface SuperWashHooks {
  onStep?: (i: number, machines: number, flow: number, best: number) => void;
  onDone?: (steps: number) => void;
}

export function findMinSteps(machines: readonly number[], hooks: SuperWashHooks = {}): number {
  const n = machines.length;
  const sum = machines.reduce((a, b) => a + b, 0);
  if (sum % n !== 0) return -1;
  const avg = sum / n;
  let flow = 0;
  let best = 0;
  for (let i = 0; i < n; i++) {
    const diff = machines[i]! - avg;
    flow += diff;
    const cur = Math.max(Math.abs(flow), diff);
    if (cur > best) best = cur;
    hooks.onStep?.(i, machines[i]!, flow, best);
  }
  hooks.onDone?.(best);
  return best;
}
