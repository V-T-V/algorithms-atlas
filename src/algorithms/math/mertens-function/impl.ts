// =============================================================================
// Mertens 函数 · 纯算法实现
// 线性筛 μ → 前缀和 M。
// =============================================================================

export interface MertensResult {
  mu: number[]; // μ(k)，索引 0..n
  M: number[]; // M(k) = Σ μ，索引 0..n
}

/** 事件钩子。 */
export interface MertensHooks {
  /** μ 表构造完成。 */
  onMuReady?: (mu: number[]) => void;
  /** 前缀和累计到位置 i，M[i] = m。 */
  onPrefix?: (i: number, m: number) => void;
  /** 完成。 */
  onDone?: (n: number, M: number) => void;
}

/** 线性筛求 μ(k) for k in [0, n]。 */
export function mobiusSieve(n: number): number[] {
  const mu = new Array<number>(n + 1).fill(0);
  const isComp = new Array<boolean>(n + 1).fill(false);
  const primes: number[] = [];
  if (n >= 1) mu[1] = 1;
  for (let i = 2; i <= n; i++) {
    if (!isComp[i]) {
      primes.push(i);
      mu[i] = -1;
    }
    for (const p of primes) {
      const c = i * p;
      if (c > n) break;
      isComp[c] = true;
      if (i % p === 0) {
        mu[c] = 0; // 含平方因子 p^2
        break;
      } else {
        mu[c] = -mu[i]!;
      }
    }
  }
  return mu;
}

/**
 * 计算 Mertens 函数 M(k) for k in [0, n]。
 * @returns { mu, M }
 */
export function mertens(n: number, hooks: MertensHooks = {}): MertensResult {
  if (n < 0) throw new RangeError('mertens: n must be non-negative');
  const mu = mobiusSieve(n);
  const M = new Array<number>(n + 1).fill(0);
  hooks.onMuReady?.(mu);
  let acc = 0;
  for (let k = 1; k <= n; k++) {
    acc += mu[k]!;
    M[k] = acc;
    hooks.onPrefix?.(k, acc);
  }
  hooks.onDone?.(n, M[n] ?? 0);
  return { mu, M };
}
