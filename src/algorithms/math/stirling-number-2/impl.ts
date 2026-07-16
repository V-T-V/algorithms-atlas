// =============================================================================
// 第二类 Stirling 数（显式公式）· 纯算法实现
// S(n,k) = (1/k!) Σ_{j=0}^{k} (-1)^j C(k,j) (k-j)^n。BigInt 精确。
// =============================================================================

/** 事件钩子。 */
export interface StirlingNumber2Hooks {
  /** 第 j 项：(−1)^j · C(k,j) · (k−j)^n。 */
  onTerm?: (j: number, term: bigint) => void;
  /** 完成求和、除以 k!。 */
  onResult?: (value: bigint) => void;
}

function pow(base: bigint, exp: number): bigint {
  let b = base;
  let e = exp;
  let r = 1n;
  while (e > 0) {
    if (e & 1) r *= b;
    b *= b;
    e >>= 1;
  }
  return r;
}

/** C(k, j) as BigInt. */
function binom(k: number, j: number): bigint {
  if (j < 0 || j > k) return 0n;
  let r = 1n;
  for (let i = 0; i < j; i++) r = (r * BigInt(k - i)) / BigInt(i + 1);
  return r;
}

/** k! as BigInt. */
function factorial(k: number): bigint {
  let r = 1n;
  for (let i = 2; i <= k; i++) r *= BigInt(i);
  return r;
}

/**
 * 第二类 Stirling 数 S(n, k)（显式公式）。
 * @returns S(n, k)；n<0 或 k<0 或 k>n（n>0）时返回 0n
 */
export function stirlingNumber2(n: number, k: number, hooks: StirlingNumber2Hooks = {}): bigint {
  if (n < 0 || k < 0) return 0n;
  if (n === 0 && k === 0) return 1n;
  if (k === 0 || k > n) return 0n;

  let sum = 0n;
  for (let j = 0; j <= k; j++) {
    const sign = j % 2 === 0 ? 1n : -1n;
    const term = sign * binom(k, j) * pow(BigInt(k - j), n);
    sum += term;
    hooks.onTerm?.(j, term);
  }
  const result = sum / factorial(k); // 整除
  hooks.onResult?.(result);
  return result;
}
