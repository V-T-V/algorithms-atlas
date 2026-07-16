// =============================================================================
// 三次样条插值（自然边界）· 纯算法实现
// =============================================================================

export interface SplineCoeffs {
  // 每段 i 的系数，表达为 [x_i, x_{i+1}] 上关于 (x - x_i) 的多项式：
  //   S_i(x) = a_i + b_i (x-x_i) + c_i (x-x_i)^2 + d_i (x-x_i)^3
  x: number[]; // 节点（升序）
  a: number[];
  b: number[];
  c: number[];
  d: number[];
}

export interface SplineHooks {
  onSolveM?: (M: number[]) => void;
}

/** 构造自然三次样条。 */
export function buildSpline(xs: number[], ys: number[], hooks: SplineHooks = {}): SplineCoeffs {
  const n = xs.length - 1;
  if (n < 1) throw new RangeError('至少需要 2 个节点');
  for (let i = 0; i < n; i++) {
    if (xs[i]! >= xs[i + 1]!) throw new RangeError('节点必须严格升序');
  }
  // h_i = x_{i+1} - x_i
  const h: number[] = [];
  for (let i = 0; i < n; i++) h.push(xs[i + 1]! - xs[i]!);

  // 解自然样条的二阶导 M_i（i=0..n），M_0 = M_n = 0
  const M = new Array<number>(n + 1).fill(0);
  if (n >= 2) {
    // 三对角方程组：对 i=1..n-1
    //   h_{i-1} M_{i-1} + 2(h_{i-1}+h_i) M_i + h_i M_{i+1} = 6(α_i)
    //   α_i = (y_{i+1}-y_i)/h_i - (y_i-y_{i-1})/h_{i-1}
    const size = n - 1;
    const lower: number[] = new Array(size).fill(0); // 下对角
    const diag: number[] = new Array(size).fill(0);
    const upper: number[] = new Array(size).fill(0);
    const rhs: number[] = new Array(size).fill(0);
    for (let i = 1; i <= n - 1; i++) {
      const j = i - 1;
      diag[j] = 2 * (h[i - 1]! + h[i]!);
      if (j > 0) lower[j] = h[i - 1]!;
      if (j < size - 1) upper[j] = h[i]!;
      rhs[j] = 6 * ((ys[i + 1]! - ys[i]!) / h[i]! - (ys[i]! - ys[i - 1]!) / h[i - 1]!);
    }
    // Thomas 算法
    for (let j = 1; j < size; j++) {
      const f = lower[j]! / diag[j - 1]!;
      diag[j]! -= f * upper[j - 1]!;
      rhs[j]! -= f * rhs[j - 1]!;
    }
    // 回代（内部 M 对应 M_1..M_{n-1}）
    const innerM = new Array<number>(size).fill(0);
    innerM[size - 1] = rhs[size - 1]! / diag[size - 1]!;
    for (let j = size - 2; j >= 0; j--) {
      innerM[j] = (rhs[j]! - upper[j]! * innerM[j + 1]!) / diag[j]!;
    }
    for (let i = 1; i <= n - 1; i++) M[i] = innerM[i - 1]!;
  }
  hooks.onSolveM?.(M);

  // 每段系数（关于 t = x - x_i）
  const a: number[] = [];
  const b: number[] = [];
  const c: number[] = [];
  const dd: number[] = [];
  for (let i = 0; i < n; i++) {
    const hi = h[i]!;
    a.push(ys[i]!);
    b.push((ys[i + 1]! - ys[i]!) / hi - (hi * (2 * M[i]! + M[i + 1]!)) / 6);
    c.push(M[i]! / 2);
    dd.push((M[i + 1]! - M[i]!) / (6 * hi));
  }
  return { x: [...xs], a, b, c, d: dd };
}

/** 在样条上求值 x。 */
export function evalSpline(s: SplineCoeffs, x: number): number {
  // 二分找段
  const n = s.a.length;
  if (x < s.x[0]! || x > s.x[n]!) throw new RangeError('x 越界');
  let i = 0;
  if (n > 1) {
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (s.x[mid + 1]! < x) lo = mid + 1;
      else hi = mid;
    }
    i = lo;
  }
  const t = x - s.x[i]!;
  return s.a[i]! + s.b[i]! * t + s.c[i]! * t * t + s.d[i]! * t * t * t;
}
