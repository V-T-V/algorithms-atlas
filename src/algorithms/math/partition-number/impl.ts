// =============================================================================
// 整数划分数（Partition Number p(n)）· 纯算法实现
// p(n) = 把 n 拆成若干正整数之和（不计顺序）的方案数。
//   递推（基于最大部分或部分数）：p(n,k) 表示拆成恰 k 个部分的方案数，
//   p(n,k) = p(n-1,k-1) + p(n-k,k)（要么某部分为 1、去掉它；要么所有部分减 1）。
//   p(n) = Σ_{k=1..n} p(n,k)。时间 O(n²)，与五边形数定理配合更快（见 pentagonal-theorem）。
// =============================================================================

export interface PartitionHooks {
  onCell?: (n: number, k: number, val: number) => void;
  onResult?: (val: number) => void;
}

export function partitionNumber(n: number, mod: number, hooks: PartitionHooks = {}): number {
  if (n < 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n === 0) {
    hooks.onResult?.(1 % mod);
    return 1 % mod;
  }
  // dp[n][k] = 拆成恰 k 部分
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  dp[0]![0] = 1 % mod;
  for (let i = 1; i <= n; i++) {
    for (let k = 1; k <= i; k++) {
      let v = dp[i - 1]![k - 1]!;
      if (i >= k) v = (v + dp[i - k]![k]!) % mod;
      dp[i]![k] = v;
      hooks.onCell?.(i, k, v);
    }
  }
  let total = 0;
  for (let k = 1; k <= n; k++) total = (total + dp[n]![k]!) % mod;
  hooks.onResult?.(total);
  return total;
}

/** BigInt 精确 p(n)。 */
export function partitionNumberBig(n: number): bigint {
  if (n < 0) return 0n;
  if (n === 0) return 1n;
  const dp: bigint[][] = Array.from({ length: n + 1 }, () => new Array<bigint>(n + 1).fill(0n));
  dp[0]![0] = 1n;
  for (let i = 1; i <= n; i++) {
    for (let k = 1; k <= i; k++) {
      let v = dp[i - 1]![k - 1]!;
      if (i >= k) v += dp[i - k]![k]!;
      dp[i]![k] = v;
    }
  }
  let total = 0n;
  for (let k = 1; k <= n; k++) total += dp[n]![k]!;
  return total;
}
