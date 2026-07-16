// =============================================================================
// 概率 DP（Probability DP）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：独立抛 n 枚硬币（每枚正面概率 p），求恰好得到 k 枚正面的概率（二项分布）。
// =============================================================================

/** 输入：硬币数 n、单枚正面概率 p、目标正面数 k。 */
export interface CoinTossInput {
  /** 抛硬币次数。 */
  n: number;
  /** 单枚硬币出现正面的概率 ∈ [0,1]。 */
  p: number;
  /** 目标正面数 ∈ [0, n]。 */
  k: number;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface ProbabilityDpHooks {
  /** 填好 dp[i][j]：抛 i 枚硬币恰好 j 枚正面的概率。 */
  onFillCell?: (i: number, j: number, prob: number) => void;
  /** 算法完成：恰好 k 枚正面的概率。 */
  onDone?: (prob: number) => void;
}

/** 结果。 */
export interface ProbabilityDpResult {
  /** 恰好 k 枚正面的概率。 */
  prob: number;
  /** 完整 dp 表（(n+1) x (n+1)）。 */
  dp: number[][];
}

/**
 * 概率 DP 解二项分布：抛 n 枚硬币、正面概率 p，求恰好 k 枚正面的概率。
 *
 * 状态：`dp[i][j]` = 前 `i` 枚硬币恰好 `j` 枚正面的概率。
 *
 * 转移：
 *   - 第 i 枚为正面（概率 p）：`dp[i][j] += dp[i-1][j-1] · p`
 *   - 第 i 枚为反面（概率 1-p）：`dp[i][j] += dp[i-1][j] · (1-p)`
 *
 * 边界：`dp[0][0]=1`。答案 = `dp[n][k]`，恰为二项分布 `C(n,k)·p^k·(1-p)^(n-k)`。
 *
 * @param input 输入
 * @param hooks 可选事件钩子
 */
export function probabilityDp(
  input: CoinTossInput,
  hooks: ProbabilityDpHooks = {},
): ProbabilityDpResult {
  const { n, p, k } = input;
  const q = 1 - p;
  // dp[i][j]：抛 i 枚、恰好 j 枚正面
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  dp[0]![0] = 1;
  hooks.onFillCell?.(0, 0, 1);

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= i; j++) {
      let prob = 0;
      // 反面：从 dp[i-1][j] 来
      prob += (dp[i - 1]![j] ?? 0) * q;
      // 正面：从 dp[i-1][j-1] 来
      if (j > 0) prob += (dp[i - 1]![j - 1] ?? 0) * p;
      dp[i]![j] = prob;
      hooks.onFillCell?.(i, j, prob);
    }
  }

  const prob = dp[n]![k]!;
  hooks.onDone?.(prob);
  return { prob, dp };
}

/** 组合数 C(n, k)，用于校验。 */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
}
