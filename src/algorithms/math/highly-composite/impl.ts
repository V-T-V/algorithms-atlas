// =============================================================================
// 高合成数
// 枚举 [1, n]，d(k) = k 的正因子个数（含 1 与 k）。
// 记录因子数严格大于所有更小数因子数的 k（高合成数）。
// 用筛法批量计算 d(k)：O(n log n)。
// =============================================================================

export interface HighlyCompositeHooks {
  onDivisorCount?: (k: number, count: number) => void;
  onRecord?: (k: number, count: number) => void;
  onResult?: (records: Array<{ value: number; divisors: number }>) => void;
}

export interface HighlyCompositeResult {
  records: Array<{ value: number; divisors: number }>;
  divisorCounts: number[];
}

/** k 的因子个数（暴力 O(√k)）。 */
export function divisorCount(k: number): number {
  if (k < 1) return 0;
  let cnt = 0;
  for (let i = 1; i * i <= k; i++) {
    if (k % i === 0) {
      cnt += i * i === k ? 1 : 2;
    }
  }
  return cnt;
}

export function highlyCompositeUpTo(
  n: number,
  hooks: HighlyCompositeHooks = {},
): HighlyCompositeResult {
  if (n < 1) {
    hooks.onResult?.([]);
    return { records: [], divisorCounts: [] };
  }
  // 筛法求 [1,n] 的因子数
  const d = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    for (let j = i; j <= n; j += i) {
      d[j] = (d[j] ?? 0) + 1;
    }
  }
  for (let k = 1; k <= n; k++) hooks.onDivisorCount?.(k, d[k]!);

  const records: Array<{ value: number; divisors: number }> = [];
  let maxD = 0;
  for (let k = 1; k <= n; k++) {
    const dk = d[k]!;
    if (dk > maxD) {
      maxD = dk;
      records.push({ value: k, divisors: dk });
      hooks.onRecord?.(k, dk);
    }
  }
  hooks.onResult?.(records);
  return { records, divisorCounts: d };
}
