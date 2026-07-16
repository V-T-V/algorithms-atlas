// =============================================================================
// 逆离散傅里叶变换（IDFT）· 纯算法实现
// =============================================================================

export interface Complex {
  re: number;
  im: number;
}

export interface IDFTHooks {
  /** 还原出第 n 个时域样本。 */
  onSample?: (n: number, xn: Complex) => void;
  /** 完成。 */
  onDone?: (signal: Complex[]) => void;
}

const cAdd = (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im });
const cMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const cScale = (a: Complex, s: number): Complex => ({ re: a.re * s, im: a.im * s });

/**
 * 逆离散傅里叶变换（朴素 O(N²)）。
 * @param spectrum 长度 N 的频域复序列
 * @returns 长度 N 的时域复序列
 */
export function idft(spectrum: readonly Complex[], hooks: IDFTHooks = {}): Complex[] {
  const n = spectrum.length;
  if (n === 0) return [];
  const out: Complex[] = new Array(n);
  for (let nn = 0; nn < n; nn++) {
    let sum: Complex = { re: 0, im: 0 };
    const base = (2 * Math.PI * nn) / n;
    for (let k = 0; k < n; k++) {
      const angle = base * k;
      const twiddle: Complex = { re: Math.cos(angle), im: Math.sin(angle) };
      sum = cAdd(sum, cMul(spectrum[k]!, twiddle));
    }
    out[nn] = cScale(sum, 1 / n);
    hooks.onSample?.(nn, out[nn]!);
  }
  hooks.onDone?.(out);
  return out;
}
