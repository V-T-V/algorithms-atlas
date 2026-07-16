// =============================================================================
// 整数拆分 · 纯算法实现
// =============================================================================

export interface IntBreakHooks {
  onStep?: (threes: number, remainder: number, partial: number[]) => void;
  onResult?: (factors: number[], product: number) => void;
}

export function integerBreak(n: number, hooks: IntBreakHooks = {}): number {
  if (n < 2 || !Number.isInteger(n)) {
    throw new Error(`n 必须 >= 2 的整数 / must be an integer >= 2, got ${n}`);
  }
  if (n === 2) {
    hooks.onResult?.([1, 1], 1);
    return 1;
  }
  if (n === 3) {
    hooks.onResult?.([1, 2], 2);
    return 2;
  }
  const threes = Math.floor(n / 3);
  const remainder = n % 3;
  let product: number;
  let factors: number[];
  if (remainder === 0) {
    product = 3 ** threes;
    factors = new Array(threes).fill(3);
  } else if (remainder === 1) {
    // 一个 3 + 1 → 2 + 2
    product = 3 ** (threes - 1) * 4;
    factors = [...new Array(threes - 1).fill(3), 2, 2];
  } else {
    product = 3 ** threes * 2;
    factors = [...new Array(threes).fill(3), 2];
  }
  // 逐个 3 的累积过程（展示贪心分解的「尽可能多 3」）
  const partial: number[] = [];
  for (let k = 0; k < threes; k++) {
    partial.push(3);
    hooks.onStep?.(k + 1, remainder, [...partial]);
  }
  hooks.onResult?.(factors, product);
  return product;
}

/** 暴力 DP 验证。 */
export function integerBreakDp(n: number): number {
  const dp = new Array<number>(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    for (let j = 1; j < i; j++) {
      dp[i] = Math.max(dp[i]!, j * (i - j), j * dp[i - j]!);
    }
  }
  return dp[n]!;
}
