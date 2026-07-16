// =============================================================================
// FFT（Cooley-Tukey 迭代，基-2）· 纯算法实现
// =============================================================================

export type Complex = { re: number; im: number };

export function cAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}
export function cSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}
export function cMul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

/** 位反转（用于迭代 FFT 的位逆序重排）。 */
function bitReverse(x: number, bits: number): number {
  let r = 0;
  for (let i = 0; i < bits; i++) {
    r = (r << 1) | (x & 1);
    x >>= 1;
  }
  return r;
}

function isPow2(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Cooley-Tukey 基-2 FFT（迭代）。
 * inverse=false → 正向 DFT，inverse=true → 逆 DFT（结果除以 N）。
 * 输入长度必须是 2 的幂。
 */
export function fft(input: Complex[], inverse = false): Complex[] {
  const N = input.length;
  if (N === 0) return [];
  if (!isPow2(N)) throw new RangeError('长度必须是 2 的幂');
  // 复制
  const a: Complex[] = input.map((c) => ({ re: c.re, im: c.im }));
  // 位逆序重排
  const bits = Math.log2(N);
  for (let i = 0; i < N; i++) {
    const j = bitReverse(i, bits);
    if (j > i) {
      const tmp = a[i]!;
      a[i] = a[j]!;
      a[j] = tmp;
    }
  }
  // 蝶形
  const sign = inverse ? 1 : -1;
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (sign * 2 * Math.PI) / len;
    const wLen: Complex = { re: Math.cos(ang), im: Math.sin(ang) };
    for (let i = 0; i < N; i += len) {
      let w: Complex = { re: 1, im: 0 };
      for (let k = 0; k < len / 2; k++) {
        const u = a[i + k]!;
        const v = cMul(w, a[i + k + len / 2]!);
        a[i + k] = cAdd(u, v);
        a[i + k + len / 2] = cSub(u, v);
        w = cMul(w, wLen);
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < N; i++) {
      a[i]!.re /= N;
      a[i]!.im /= N;
    }
  }
  return a;
}

/** 便捷：从实数数组构造并执行 FFT（补零到 2 的幂）。 */
export function fftReal(input: number[], inverse = false): Complex[] {
  if (input.length === 0) return [];
  let N = 1;
  while (N < input.length) N <<= 1;
  const c: Complex[] = [];
  for (let i = 0; i < N; i++) c.push({ re: input[i] ?? 0, im: 0 });
  return fft(c, inverse);
}
