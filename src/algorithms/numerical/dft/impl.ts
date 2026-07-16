// =============================================================================
// 离散傅里叶变换（DFT）· 纯算法实现
// O(N²) 朴素版本，输出复数数组。
// =============================================================================

export interface Complex {
  re: number;
  im: number;
}

export interface DFTHooks {
  /** 计算出第 k 个频域分量。 */
  onBin?: (k: number, xk: Complex) => void;
  /** 完成。 */
  onDone?: (spectrum: Complex[]) => void;
}

const cAdd = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im });
const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

/** 把实数数组转复数数组（虚部 0）。 */
export function toComplex(real: readonly number[]): Complex[] {
  return real.map((x) => ({ re: x, im: 0 }));
}

/** 复数的模（幅度）。 */
export function cAbs(c: Complex): number {
  return Math.hypot(c.re, c.im);
}

/**
 * 离散傅里叶变换（朴素 O(N²)）。
 * @param input 长度 N 的（复）序列
 */
export function dft(input: readonly Complex[], hooks: DFTHooks = {}): Complex[] {
  const n = input.length;
  if (n === 0) return [];
  const out: Complex[] = new Array(n);
  for (let k = 0; k < n; k++) {
    let sum: Complex = { re: 0, im: 0 };
    const base = (-2 * Math.PI * k) / n;
    for (let nn = 0; nn < n; nn++) {
      const angle = base * nn;
      const twiddle: Complex = { re: Math.cos(angle), im: Math.sin(angle) };
      sum = cAdd(sum, cMul(input[nn]!, twiddle));
    }
    out[k] = sum;
    hooks.onBin?.(k, sum);
  }
  hooks.onDone?.(out);
  return out;
}
