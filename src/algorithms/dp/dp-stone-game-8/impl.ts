// =============================================================================
// 石子游戏 VIII · 纯算法实现
// dp[i] = 当前剩余石子从下标 i 开始（即 stones[i..n-1]）时，当前玩家可获得的最大分差。
// 第一次操作必须取至少前两块（i>=1），故答案 = dp[1]。
// 递推：dp[n-1]=prefix[n-1]；dp[i]=max(dp[i+1], prefix[i]-dp[i+1])，自右向左。
// =============================================================================

export interface StoneGame8Hooks {
  onStep?: (i: number, dp: number) => void;
  onDone?: (diff: number) => void;
}

export function stoneGame8(values: readonly number[], hooks: StoneGame8Hooks = {}): number {
  const n = values.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  // prefix[i] = values[0] + ... + values[i]
  const prefix = new Array<number>(n).fill(0);
  prefix[0] = values[0]!;
  for (let i = 1; i < n; i++) prefix[i] = prefix[i - 1]! + values[i]!;

  const dp = new Array<number>(n).fill(0);
  dp[n - 1] = prefix[n - 1]!;
  hooks.onStep?.(n - 1, dp[n - 1]!);
  for (let i = n - 2; i >= 1; i--) {
    dp[i] = Math.max(dp[i + 1]!, prefix[i]! - dp[i + 1]!);
    hooks.onStep?.(i, dp[i]!);
  }
  // n==1: 只有一块石头，无法操作，分差为 0；否则第一次必须至少取两块，答案 = dp[1]
  const ans = n >= 2 ? dp[1]! : 0;
  hooks.onDone?.(ans);
  return ans;
}
