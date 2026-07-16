// 整数划分 · 实现
export interface Pp2Hooks {
  onValue?: (i: number, p: number) => void;
  onConclude?: (values: number[]) => void;
}
export function partitionP(n: number, hooks: Pp2Hooks = {}): number[] {
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  for (let k = 1; k <= n; k++) for (let i = k; i <= n; i++) dp[i]! += dp[i - k]!;
  for (let i = 0; i <= n; i++) hooks.onValue?.(i, dp[i]!);
  hooks.onConclude?.(dp);
  return dp;
}
