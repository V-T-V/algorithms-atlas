// =============================================================================
// 最大表现 · 纯算法实现 (LeetCode 1383)
// 按效率降序遍历，最小堆维护至多 k 个最大速度，过程中取最大 min(eff)*sum(speed)。
// =============================================================================
export interface GreedyMaxPerformanceHooks {
  onConsider?: (engineer: number, eff: number, speed: number) => void;
  onEval?: (minEff: number, speedSum: number, perf: number) => void;
  onConclude?: (best: number) => void;
}

const MOD = 10 ** 9 + 7;

export function greedyMaxPerformance(
  n: number,
  speed: readonly number[],
  efficiency: readonly number[],
  k: number,
  hooks: GreedyMaxPerformanceHooks = {},
): number {
  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((a, b) => efficiency[b]! - efficiency[a]!);

  let speedSum = 0;
  let best = 0;
  // 最小堆（用数组模拟）
  const heap: number[] = [];
  const push = (v: number): void => {
    heap.push(v);
    heap.sort((a, b) => a - b);
  };
  const popMin = (): number => {
    const min = heap.shift()!;
    return min;
  };

  for (const idx of order) {
    const eff = efficiency[idx]!;
    const sp = speed[idx]!;
    hooks.onConsider?.(idx, eff, sp);
    push(sp);
    speedSum += sp;
    if (heap.length > k) {
      speedSum -= popMin();
    }
    const perf = eff * speedSum;
    hooks.onEval?.(eff, speedSum, perf);
    if (perf > best) best = perf;
  }
  hooks.onConclude?.(best);
  return best % MOD;
}
