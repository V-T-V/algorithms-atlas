// =============================================================================
// 鸡蛋掉落·二分优化 DP
// dp[k][n] = 1 + min over i in [1,n] of max(dp[k-1][i-1], dp[k][n-i])
// 利用 dp[k-1][i-1] 随 i 递增、dp[k][n-i] 随 i 递减，对 i 二分求交点。
// =============================================================================

export interface EggDropHooks {
  onCell?: (k: number, n: number, value: number) => void;
  onResult?: (answer: number) => void;
}

export interface EggDropResult {
  answer: number;
  /** dp 表：dp[k][n]，k 从 1 起，n 从 0 起。 */
  table: number[][];
}

export function superEggDrop(K: number, N: number, hooks: EggDropHooks = {}): EggDropResult {
  if (K <= 0 || N <= 0) {
    hooks.onResult?.(0);
    return { answer: 0, table: [] };
  }
  // dp[k][n]，k∈[1,K], n∈[0,N]
  const dp: number[][] = Array.from({ length: K + 1 }, () => new Array<number>(N + 1).fill(0));
  // 1 个鸡蛋：n 层需 n 次
  for (let n = 1; n <= N; n++) dp[1]![n] = n;
  for (let n = 1; n <= N; n++) hooks.onCell?.(1, n, n);

  for (let k = 2; k <= K; k++) {
    for (let n = 1; n <= N; n++) {
      // 二分找 i* 使 dp[k-1][i-1] <= dp[k][n-i]
      let lo = 1;
      let hi = n;
      let best = Infinity;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const broken = dp[k - 1]![mid - 1]!; // 蛋碎：下面 mid-1 层
        const safe = dp[k]![n - mid]!; // 蛋不碎：上面 n-mid 层
        const cost = 1 + Math.max(broken, safe);
        if (cost < best) best = cost;
        if (broken < safe) {
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      dp[k]![n] = best;
      hooks.onCell?.(k, n, best);
    }
  }

  const answer = dp[K]![N]!;
  hooks.onResult?.(answer);
  return { answer, table: dp };
}
