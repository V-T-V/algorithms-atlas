// =============================================================================
// Min_25 筛 Min_25 Sieve · 纯算法实现
// 在约 O(n^{3/4} / log n) 时间内求积性函数 f 的前缀和 S(n) = Σ_{i=1}^{n} f(i)，
// 其中 f 在素数处的取值是「低次多项式」（这是 Min_25 成立的条件）。
//
// 这里实现最经典、最易验证的用法：求 n 以内所有素数之和
//   Σ_{p ≤ n} p   （等价于取 f(p)=p 并仅保留素数项）。
// 完整保留 Min_25 第一阶段（数论分块 + 筛素数 DP）的结构，可直接处理 n 高达 10^10。
//
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

import { phiSieve } from '../phi-sieve/impl.ts';

/**
 * 事件钩子。任一可选。
 */
export interface Min25Hooks {
  /** 第一阶段初始化：√n 与 ≤√n 的素数个数。 */
  onInit?: (sqrtN: number, primeCount: number) => void;
  /** 第一阶段：用素数 p 松弛 g 值。 */
  onRelaxPrime?: (p: number) => void;
  /** 完成：得到 Σ_{p≤n} p。 */
  onDone?: (n: number, sumPrimes: bigint) => void;
}

/**
 * Min_25 筛：计算 n 以内所有素数之和 Σ_{p ≤ n} p。
 *
 * 思路（第一阶段）：
 *   - 用数论分块把所有不同的 ⌊n/v⌋ 取值作为下标集合。
 *   - 令 g[v] = Σ_{2≤j≤v} j（先把所有 ≥2 的整数都当作「候选素数」）。
 *   - 对每个素数 p ≤ √n，按 Min_25 的递推把 p 的倍数从 g 中剔除：
 *       g[v] ← g[v] − p · (g[⌊v/p⌋] − Σ_{q<p} q)。
 *   - 最终 g[n] 即为 Σ_{p≤n} p。
 *
 * @param n 上界（≥1 的整数）。
 * @param hooks 事件钩子（可选）。
 * @returns Σ_{p ≤ n} p。
 */
export function min25(n: number, hooks: Min25Hooks = {}): bigint {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError('min25 需要 n 为不小于 1 的整数');
  }
  if (n < 2) {
    hooks.onDone?.(n, 0n);
    return 0n;
  }

  // —— 数论分块：所有不同的 ⌊n/v⌋ 值（去重；按下标 0..m-1 从大到小排列）——
  const r = Math.floor(Math.sqrt(n));
  const values: number[] = [];
  const idxBig = new Map<number, number>(); // 取值 > r 的下标
  const idxSmall = new Map<number, number>(); // 取值 ≤ r 的下标
  for (let l = 1; l <= n; ) {
    const d = Math.floor(n / l);
    const rr = Math.floor(n / d);
    const idx = values.length;
    values.push(d);
    if (d <= r) idxSmall.set(d, idx);
    else idxBig.set(d, idx);
    l = rr + 1;
  }
  const m = values.length;
  const indexOf = (v: number): number => (v <= r ? idxSmall.get(v)! : idxBig.get(v)!);

  // —— 第一阶段：g[i] 表示「≤ values[i] 的所有素数之和」的下界 DP ——
  // 初值：g[i] = Σ_{j=2}^{values[i]} j = v(v+1)/2 − 1
  let g = values.map((v) => (BigInt(v) * BigInt(v + 1)) / 2n - 1n);

  // 收集所有 ≤ √n 的素数
  const phi = phiSieve(r);
  const primes: number[] = [];
  for (let i = 2; i <= r; i++) if (phi[i] === i - 1) primes.push(i);
  hooks.onInit?.(r, primes.length);

  // 松弛：g[i] -= p * (g[⌊v/p⌋] − Σ_{q<p} q)
  // 维护 sp = Σ_{q<p, q 素} q 作为常量
  let sp = 0n;
  for (const p of primes) {
    hooks.onRelaxPrime?.(p);
    const pBig = BigInt(p);
    const p2 = pBig * pBig;
    const gNew = g.slice();
    // values 按下标 0..m-1 对应「从大到小」，故遇到 v<p² 后即可提前结束。
    for (let i = 0; i < m; i++) {
      const v = values[i]!;
      if (BigInt(v) < p2) break;
      const j = indexOf(Math.floor(v / p));
      gNew[i] = g[i]! - pBig * (g[j]! - sp);
    }
    g = gNew;
    sp += pBig;
  }

  // g 对应 v=n 的下标即为 Σ_{p≤n} p
  const sumPrimes = g[indexOf(n)]!;
  hooks.onDone?.(n, sumPrimes);
  return sumPrimes;
}
