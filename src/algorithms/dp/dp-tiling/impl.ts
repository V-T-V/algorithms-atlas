// =============================================================================
// 铺砖 DP：用 1×2 多米诺铺满 2×N，方案数 = Fibonacci。
// dp[n] = dp[n-1] + dp[n-2]; dp[0]=1, dp[1]=1
// =============================================================================

export interface TilingHooks {
  onStep?: (n: number, value: number) => void;
  onResult?: (ways: number, dp: number[]) => void;
}

export interface TilingResult {
  ways: number;
  dp: number[];
}

export function tilingDomino2xN(n: number, hooks: TilingHooks = {}): TilingResult {
  if (n < 0) {
    hooks.onResult?.(0, []);
    return { ways: 0, dp: [] };
  }
  if (n === 0) {
    hooks.onStep?.(0, 1);
    hooks.onResult?.(1, [1]);
    return { ways: 1, dp: [1] };
  }
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  hooks.onStep?.(0, 1);
  hooks.onStep?.(1, 1);
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    hooks.onStep?.(i, dp[i]!);
  }
  hooks.onResult?.(dp[n]!, dp);
  return { ways: dp[n]!, dp };
}
