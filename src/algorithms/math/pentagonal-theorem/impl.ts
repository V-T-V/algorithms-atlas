// =============================================================================
// 欧拉五边形数定理（计算划分数）· 纯算法实现
// p(n) = Σ_{k≠0} (-1)^(k-1) p(n - g_k)，其中 g_k = k(3k-1)/2 为广义五边形数（k=±1,±2,…）。
// 该公式把划分数计算降到 O(n√n) 时间、O(n) 空间，比 O(n²) 的 DP 更优。
// =============================================================================

export interface PentagonalHooks {
  onTerm?: (g: number, sign: number, residual: number) => void;
  onStep?: (n: number, val: number) => void;
  onResult?: (table: number[]) => void;
}

/** 用五边形数定理计算 p(0..N) 表。 */
export function partitionByPentagonal(
  N: number,
  mod: number,
  hooks: PentagonalHooks = {},
): number[] {
  if (N < 0) {
    hooks.onResult?.([]);
    return [];
  }
  const p: number[] = new Array<number>(N + 1).fill(0);
  p[0] = 1 % mod;
  hooks.onStep?.(0, p[0]!);
  // 预生成五边形数（直到不超过 N）
  const pentas: Array<{ g: number; sign: number }> = [];
  for (let k = 1; ; k++) {
    const g1 = (k * (3 * k - 1)) / 2;
    const g2 = (k * (3 * k + 1)) / 2;
    if (g1 > N) break;
    pentas.push({ g: g1, sign: k % 2 === 1 ? 1 : -1 });
    if (g2 <= N) pentas.push({ g: g2, sign: k % 2 === 1 ? 1 : -1 });
  }

  for (let n = 1; n <= N; n++) {
    let val = 0;
    for (const { g, sign } of pentas) {
      if (g > n) break;
      hooks.onTerm?.(g, sign, n - g);
      val = (val + sign * p[n - g]!) % mod;
    }
    val = ((val % mod) + mod) % mod; // 保证非负
    p[n] = val;
    hooks.onStep?.(n, val);
  }
  hooks.onResult?.([...p]);
  return p;
}
