// =============================================================================
// 最少侧跳次数 · 纯算法实现
// dp[l] = 到当前位置第 l 道的最少侧跳数。
// =============================================================================

export interface MinSidewayJumpsHooks {
  onPos?: (i: number, dp: number[]) => void;
  onResult?: (jumps: number) => void;
}

export function minSideJumps(
  obstacles: readonly number[],
  hooks: MinSidewayJumpsHooks = {},
): number {
  // dp[l] 表示到达当前位置第 l 道的最小侧跳次数，l∈{1,2,3}
  let dp = [0, 1, 0, 1]; // 索引 0 占位
  const n = obstacles.length;
  hooks.onPos?.(0, dp);
  for (let i = 1; i < n; i++) {
    const ob = obstacles[i]!;
    // 该位置某道有障碍则不可达
    if (ob > 0) dp[ob] = Infinity;
    // 更新每道：从另外两道跳过来
    const next: number[] = [0, dp[1]!, dp[2]!, dp[3]!];
    if (ob !== 1) next[1] = Math.min(dp[1]!, dp[2]! + 1, dp[3]! + 1);
    if (ob !== 2) next[2] = Math.min(dp[2]!, dp[1]! + 1, dp[3]! + 1);
    if (ob !== 3) next[3] = Math.min(dp[3]!, dp[1]! + 1, dp[2]! + 1);
    dp = next;
    hooks.onPos?.(i, dp);
  }
  const ans = Math.min(dp[1]!, dp[2]!, dp[3]!);
  hooks.onResult?.(ans);
  return ans;
}
