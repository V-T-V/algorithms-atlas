// =============================================================================
// 比内公式 Binet Formula · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BinetFormulaHooks {
  /** 由二项式展开累加得到分子 num（BigInt 字符串）与分母 2^(n-1)。 */
  onPowers?: (numStr: string, denStr: string) => void;
  /** 得到第 n 个斐波那契数 F_n（精确整数）。 */
  onResult?: (n: number, fn: number) => void;
}

/**
 * 比内公式（Binet Formula）：斐波那契数的闭式。
 *
 * 公式：`F_n = (φ^n − ψ^n) / √5`，其中 `φ = (1+√5)/2`（黄金比），`ψ = (1−√5)/2`。
 *
 * 直接用浮点计算 `√5` 与幂会在 `n` 较大时产生误差。本实现采用**整数精确路径**，
 * 基于二项式展开推导出整系数表达式：
 *
 * 由 `(φ^n − ψ^n) = [(1+√5)^n − (1−√5)^n] / 2^n`，展开后偶次项相消、奇次项相加，
 * 再除以 `√5` 得到整数：
 *
 * `F_n = Σ_{k 奇, 1≤k≤n} C(n,k) · 5^{(k-1)/2} / 2^{n-1}`
 *
 * 用 `BigInt` 精确累加，最后整除得到 `F_n`。
 *
 * - 时间 `O(n)`（按项累加；可优化到 `O(log n)` 但此处强调闭式结构）
 * - 空间 `O(1)`
 *
 * @param n 非负整数下标
 * @returns 斐波那契数 F_n（在 Number 安全整数范围内返回 number）
 */
export function binetFormula(n: number, hooks: BinetFormulaHooks = {}): number {
  if (n < 0) throw new RangeError('binetFormula: n must be non-negative');
  if (n === 0) {
    hooks.onResult?.(0, 0);
    return 0;
  }

  // 分子 = Σ_{k 奇} C(n,k) · 5^{(k-1)/2}
  let num = 0n;
  for (let k = 1; k <= n; k += 2) {
    const c = binom(n, k);
    const halfPower = (k - 1) / 2;
    num += c * pow5(halfPower);
  }
  // 分母 = 2^{n-1}
  const den = 1n << BigInt(n - 1);
  const fn = num / den; // 理论上整除

  hooks.onPowers?.(num.toString(), den.toString());
  hooks.onResult?.(n, Number(fn));
  return Number(fn);
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

/** 5 的 e 次幂。 */
function pow5(e: number): bigint {
  let r = 1n;
  for (let i = 0; i < e; i++) r *= 5n;
  return r;
}
