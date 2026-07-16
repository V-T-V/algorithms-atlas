// =============================================================================
// 扔鸡蛋（Egg Drop）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：k 个鸡蛋、n 层楼，求最坏情况下最少扔几次能确定临界楼层。
// 用「逆向」DP：f(t,k) = t 次尝试、k 个鸡蛋最多能分辨多少层，
//   f(t,k) = f(t-1,k-1) + 1 + f(t-1,k)。求最小 t 使 f(t,k) >= n。O(k log n)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface EggDropHooks {
  /** 新增一次尝试：用 t 次、k 个鸡蛋能分辨 cover 层。 */
  onStep?: (t: number, k: number, cover: number) => void;
  /** 达到目标楼层数 n，确定答案 t。 */
  onFound?: (t: number, cover: number) => void;
}

/**
 * 扔鸡蛋：k 个鸡蛋、n 层楼，最坏情况下最少扔几次确定临界楼层。
 *
 * 逆向递推：`f(t, k)` = 用 `t` 次尝试、`k` 个鸡蛋能确定的最多楼层数。
 *   - 在某层扔一次：若碎，剩下 `t-1` 次、`k-1` 个鸡蛋（往下试 `f(t-1,k-1)` 层）；
 *     若不碎，剩 `t-1` 次、`k` 个鸡蛋（往上试 `f(t-1,k)` 层），加上本层 1。
 *   - 故 `f(t,k) = f(t-1,k-1) + 1 + f(t-1,k)`
 * 求最小的 `t` 使得 `f(t,k) >= n`。
 *
 * @param eggs 鸡蛋数 k（>=1）
 * @param floors 楼层数 n（>=0）
 * @param hooks 可选事件钩子
 * @returns 最少尝试次数。
 */
export function eggDrop(eggs: number, floors: number, hooks: EggDropHooks = {}): number {
  if (floors <= 0) return 0;
  if (eggs <= 0) return Infinity;
  // 一维滚动：dp[k] = f(t-1, k)，逐次尝试 t 递增
  const dp = new Array<number>(eggs + 1).fill(0); // f(0, k) = 0
  let t = 0;
  while (dp[eggs]! < floors) {
    t++;
    // 倒着更新，复用上一轮（t-1）的值
    for (let k = eggs; k >= 1; k--) {
      dp[k] = dp[k - 1]! + 1 + dp[k]!;
      hooks.onStep?.(t, k, dp[k]!);
    }
    if (dp[eggs]! >= floors) {
      hooks.onFound?.(t, dp[eggs]!);
      break;
    }
  }
  return t;
}
