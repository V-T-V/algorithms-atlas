// =============================================================================
// 狄利克雷卷积 · 纯算法实现
// (f*g)(n) = Σ_{d|n} f(d)·g(n/d)，n in [1, N]。O(N log N)。
// =============================================================================

/** 事件钩子。 */
export interface DirichletHooks {
  /** 以 d 为外层因子开始。 */
  onFactor?: (d: number, fd: number) => void;
  /** 把 f(d)·g(k) 累加进 result[d·k]。 */
  onAccumulate?: (d: number, k: number, target: number, value: number) => void;
  /** 完成。 */
  onDone?: (result: number[]) => void;
}

/**
 * 狄利克雷卷积：返回 h = f * g，h[n] = Σ_{d|n} f(d)·g(n/d)，n in [1, N]。
 * 输入 f、g 长度需 >= N+1（索引 0 不用，从 1 开始）。
 * @param f 数论函数（长度 >= N+1）
 * @param g 数论函数（长度 >= N+1）
 * @param N 上界
 */
export function dirichletConvolution(
  f: readonly number[],
  g: readonly number[],
  N: number,
  hooks: DirichletHooks = {},
): number[] {
  const h = new Array<number>(N + 1).fill(0);
  for (let d = 1; d <= N; d++) {
    const fd = f[d]!;
    hooks.onFactor?.(d, fd);
    for (let k = 1; d * k <= N; k++) {
      const target = d * k;
      const add = fd * g[k]!;
      h[target]! += add;
      hooks.onAccumulate?.(d, k, target, add);
    }
  }
  hooks.onDone?.(h);
  return h;
}

/** 常数函数 1(n) = 1，长度 N+1。 */
export function ones(N: number): number[] {
  const a = new Array<number>(N + 1).fill(1);
  a[0] = 0;
  return a;
}

/** 恒等函数 id(n) = n，长度 N+1。 */
export function identityFn(N: number): number[] {
  const a = new Array<number>(N + 1).fill(0);
  for (let i = 1; i <= N; i++) a[i] = i;
  return a;
}

/** 单位函数 ε(1)=1，否则 0，长度 N+1。 */
export function epsilon(N: number): number[] {
  const a = new Array<number>(N + 1).fill(0);
  a[1] = 1;
  return a;
}
