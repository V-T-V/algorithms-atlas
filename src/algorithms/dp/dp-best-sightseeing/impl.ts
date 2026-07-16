// =============================================================================
// 最佳观光组合 · 纯算法实现
// 拆项：维护 maxAi = max(values[i]+i)。
// =============================================================================

export interface BestSightseeingHooks {
  onDay?: (i: number, maxAi: number, curScore: number, best: number) => void;
  onResult?: (score: number) => void;
}

export function maxScoreSightseeingPair(
  values: readonly number[],
  hooks: BestSightseeingHooks = {},
): number {
  const n = values.length;
  if (n < 2) {
    hooks.onResult?.(0);
    return 0;
  }
  let maxAi = values[0]! + 0;
  let best = 0;
  for (let j = 1; j < n; j++) {
    const curScore = maxAi + values[j]! - j;
    best = Math.max(best, curScore);
    hooks.onDay?.(j, maxAi, curScore, best);
    maxAi = Math.max(maxAi, values[j]! + j);
  }
  hooks.onResult?.(best);
  return best;
}
