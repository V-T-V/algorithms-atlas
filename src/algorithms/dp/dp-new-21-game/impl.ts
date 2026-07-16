// =============================================================================
// 新 21 点游戏（LeetCode 837 New 21 Game）· 纯算法实现
// Alice 从 0 分开始，当分数 < K 时，等概率抽 1..W 加分；分数 ≥ K 停止。
// 求 最终分数 ≤ N 的概率。
// dp[x] = 从分数 x 出发满足条件的概率。dp[x] = (dp[x+1]+...+dp[x+W]) / W (x<K)。
// 用滑动窗口求和优化到 O(max(N, K)+W)。
// =============================================================================

export interface New21Hooks {
  onCell?: (x: number, prob: number) => void;
  onResult?: (prob: number) => void;
}

export function new21Game(n: number, k: number, w: number, hooks: New21Hooks = {}): number {
  if (k === 0) {
    hooks.onResult?.(1);
    return 1;
  }
  if (n >= k - 1 + w) {
    hooks.onResult?.(1);
    return 1;
  }
  // dp[x]，x 从 k 到 min(n, k-1+w) 为终止好状态（≤ n 概率1，否则 0）
  // 我们用反向：从大 x 往 0 推
  const maxScore = k - 1 + w;
  const dp: number[] = new Array<number>(maxScore + 1).fill(0);
  // 对 x >= k：若 x <= n 则 1，否则 0
  for (let x = k; x <= maxScore; x++) {
    dp[x] = x <= n ? 1 : 0;
    hooks.onCell?.(x, dp[x]!);
  }
  // 滑动窗口：S = dp[k..k+W-1] 之和
  let S = 0;
  for (let x = k; x <= k + w - 1; x++) S += dp[x]!;
  for (let x = k - 1; x >= 0; x--) {
    dp[x] = S / w;
    hooks.onCell?.(x, dp[x]!);
    // 更新窗口：左端移除 dp[x+w]（如果 x+w 在 [k, maxScore]），右端加入 dp[x]
    // 当 x 减到 x-1 时，窗口为 dp[x..x+w-1]
    // 当前 dp[x] 已算，下一次 S 应 = S - dp[x+w] + dp[x]
    if (x > 0) {
      S = S - (x + w <= maxScore ? dp[x + w]! : 0) + dp[x]!;
    }
  }
  const ans = dp[0]!;
  hooks.onResult?.(ans);
  return ans;
}
