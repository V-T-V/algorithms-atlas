// =============================================================================
// 最后一块石头重量 II · 纯算法实现
// 转化为子集分割：最小化 sum-2*s1，s1 为不超过 half 的最大子集和。
// =============================================================================

export interface LastStoneHooks {
  onResult?: (weight: number, s1: number) => void;
}

export function lastStoneWeightII(stones: readonly number[], hooks: LastStoneHooks = {}): number {
  const n = stones.length;
  if (n === 0) {
    hooks.onResult?.(0, 0);
    return 0;
  }
  const sum = stones.reduce((a, b) => a + b, 0);
  const half = Math.floor(sum / 2);
  const dp: boolean[] = new Array<boolean>(half + 1).fill(false);
  dp[0] = true;
  for (const s of stones) {
    for (let j = half; j >= s; j--) {
      if (dp[j - s]!) dp[j] = true;
    }
  }
  let s1 = 0;
  for (let j = half; j >= 0; j--) {
    if (dp[j]!) {
      s1 = j;
      break;
    }
  }
  const ans = sum - 2 * s1;
  hooks.onResult?.(ans, s1);
  return ans;
}
