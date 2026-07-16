// =============================================================================
// 第二类 Stirling 数 Stirling Number S(n,k) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Stirling2Hooks {
  /** 由递推 S(n,k) = k·S(n-1,k) + S(n-1,k-1) 填表一次。 */
  onCell?: (n: number, k: number, value: bigint) => void;
  /** 完成第 n 行（n 个元素的所有划分数）。 */
  onRowDone?: (n: number, row: bigint[]) => void;
}

/**
 * 第二类 Stirling 数 `S(n, k)`：把 n 个**不同**元素划分为 k 个**非空**集合的方案数。
 *
 * 递推：`S(n, k) = k · S(n-1, k) + S(n-1, k-1)`，边界 `S(0,0)=1`，
 * `S(n,0)=S(0,k)=0`（k>0）。
 *
 * 含义：第 n 个元素要么加入前 n-1 个元素已有的某个集合（共 k 种选择，故 `k·S(n-1,k)`），
 * 要么单独成一个新的集合（`S(n-1,k-1)`）。
 *
 * 本实现自底向上填表，BigInt 精确。\n\n- 时间 `O(n·k)`，空间 `O(n·k)`
 *
 * @param n 元素个数（非负整数）
 * @param k 集合个数（非负整数）
 * @returns 整张表 `dp[i][j] = S(i,j)`（0≤i≤n, 0≤j≤k）
 */
export function stirling2(n: number, k: number, hooks: Stirling2Hooks = {}): bigint[][] {
  if (n < 0 || k < 0) throw new RangeError('stirling2: n and k must be non-negative');
  // dp[i][j] = S(i, j)
  const dp: bigint[][] = [];
  for (let i = 0; i <= n; i++) {
    const row: bigint[] = new Array(k + 1).fill(0n);
    dp.push(row);
    for (let j = 0; j <= Math.min(i, k); j++) {
      let v: bigint;
      if (i === 0 && j === 0) v = 1n;
      else if (j === 0) v = 0n;
      else {
        const a = j <= k ? dp[i - 1]![j]! : 0n; // j · S(i-1, j)
        const b = dp[i - 1]![j - 1]!; // S(i-1, j-1)
        v = BigInt(j) * a + b;
      }
      row[j] = v;
      hooks.onCell?.(i, j, v);
    }
    hooks.onRowDone?.(i, row.slice(0, Math.min(i, k) + 1));
  }
  return dp;
}
