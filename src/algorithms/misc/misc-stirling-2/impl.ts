// 第二类 Stirling 数 · 实现
export interface S2Hooks {
  onValue?: (n: number, k: number, val: number) => void;
  onConclude?: (table: number[][]) => void;
}
export function stirling2(n: number, k: number, hooks: S2Hooks = {}): number[][] {
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(k + 1).fill(0));
  dp[0]![0] = 1;
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= k; j++) {
      dp[i]![j] = j * dp[i - 1]![j]! + dp[i - 1]![j - 1]!;
      hooks.onValue?.(i, j, dp[i]![j]!);
    }
  hooks.onConclude?.(dp);
  return dp;
}
