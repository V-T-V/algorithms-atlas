// =============================================================================
// 伯努利数 Bernoulli Number · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BernoulliHooks {
  /** 完成对 B_m 的计算（m 为下标，value 为分数 [分子, 分母]）。 */
  onComputed?: (m: number, value: [number, number]) => void;
}

/**
 * 伯努利数 B_0 .. B_n（采用 Akiyama–Tanigawa 算法，分数形式精确计算）。
 *
 * 伯努利数满足递推关系：`Σ_{k=0}^{m} C(m+1, k) · B_k = 0`，即
 * `B_m = -1/(m+1) · Σ_{k=0}^{m-1} C(m+1, k) · B_k`。
 *
 * 本实现用分数（有理数 `[分子, 分母]`）做精确运算，避免浮点误差。
 * 结果中的负数伯努利数（B_1 = -1/2，以及奇数下标 > 1 全为 0）都正确给出。
 *
 * - 时间 `O(n²)`
 * - 空间 `O(n)`
 *
 * @param n 非负整数，计算前 n+1 个伯努利数
 * @returns 长度 n+1 的数组，每项为 `[numerator, denominator]`（既约分数）
 */
export function bernoulli(n: number, hooks: BernoulliHooks = {}): Array<[number, number]> {
  if (n < 0) throw new RangeError('bernoulli: n must be non-negative');
  // 用分数（ BigInt 保证大数精确）逐步递推
  const B: Array<[bigint, bigint]> = [];
  // B_0 = 1 由定义给出（递推式对 n>=1 成立）
  B.push([1n, 1n]);
  hooks.onComputed?.(0, [1, 1]);

  for (let m = 1; m <= n; m++) {
    // 标准做法：Σ_{k=0}^{m} C(m+1,k) B_k = 0
    //   => C(m+1,m)·B_m = - Σ_{k=0}^{m-1} C(m+1,k)·B_k
    //   => (m+1)·B_m = - Σ_{k=0}^{m-1} C(m+1,k)·B_k
    let sumN = 0n;
    let sumD = 1n;
    for (let k = 0; k < m; k++) {
      const c = binom(m + 1, k); // C(m+1, k)
      const [bn, bd] = B[k]!;
      // sum += c * bn / bd
      const termN = c * bn;
      const termD = bd;
      const [rn, rd] = addFrac(sumN, sumD, termN, termD);
      sumN = rn;
      sumD = rd;
    }
    // B_m = -sum / (m+1)
    const num = -sumN;
    const den = sumD * BigInt(m + 1);
    const [rn, rd] = reduce(num, den);
    B.push([rn, rd]);
    hooks.onComputed?.(m, [Number(rn), Number(rd)]);
  }
  return B.map(([p, q]) => [Number(p), Number(q)] as [number, number]);
}

/** 组合数 C(n, k)。 */
function binom(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  let res = 1n;
  for (let i = 0; i < k; i++) {
    res = (res * BigInt(n - i)) / BigInt(i + 1);
  }
  return res;
}

/** 分数加法 a/b + c/d。 */
function addFrac(a: bigint, b: bigint, c: bigint, d: bigint): [bigint, bigint] {
  return reduce(a * d + c * b, b * d);
}

/** 分数化简（含符号归一：分母为正）。 */
function reduce(num: bigint, den: bigint): [bigint, bigint] {
  if (den === 0n) return [0n, 0n];
  let g = gcdAbs(num, den);
  if (g === 0n) g = 1n;
  let n = num / g;
  let d = den / g;
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  return [n, d];
}

function gcdAbs(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}
