// =============================================================================
// 莫比乌斯反演（应用）· 纯算法实现
// 工具：线性筛 μ；反演求和 f(n)=Σ μ(d)·g(n/d)。
// =============================================================================

/** 事件钩子。 */
export interface MoebiusInversionHooks {
  /** μ 表构造完成。 */
  onMuReady?: (mu: number[]) => void;
  /** 反演求和到位置 n，得 f(n)=v。 */
  onInvert?: (n: number, v: number) => void;
  /** 完成。 */
  onDone?: (f: number[]) => void;
}

/** 线性筛 μ(k) for k in [0, n]。 */
export function moebiusSieve(n: number): number[] {
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
        mu[c] = 0;
        break;
      } else {
        mu[c] = -mu[i]!;
      }
    }
  }
  return mu;
}

/**
 * 莫比乌斯反演：给定 g（数组，索引 0..N），求 f(n)=Σ_{d|n} μ(d)·g(n/d)。
 * @returns f[0..N]
 */
export function moebiusInvert(
  g: readonly number[],
  N: number,
  hooks: MoebiusInversionHooks = {},
): number[] {
  const mu = moebiusSieve(N);
  hooks.onMuReady?.(mu);
  const f = new Array<number>(N + 1).fill(0);
  for (let n = 1; n <= N; n++) {
    let s = 0;
    for (let d = 1; d * d <= n; d++) {
      if (n % d === 0) {
        s += mu[d]! * g[n / d]!;
        const other = n / d;
        if (other !== d) s += mu[other]! * g[d]!;
      }
    }
    f[n] = s;
    hooks.onInvert?.(n, s);
  }
  hooks.onDone?.(f);
  return f;
}

/** 约数和 σ(n)：g(n)=Σ_{d|n} d，用于演示反演恢复恒等函数。 */
export function divisorSum(N: number): number[] {
  const sigma = new Array<number>(N + 1).fill(0);
  for (let d = 1; d <= N; d++) {
    for (let k = d; k <= N; k += d) sigma[k]! += d;
  }
  return sigma;
}
