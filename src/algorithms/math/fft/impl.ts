// =============================================================================
// 快速傅里叶变换 Fast Fourier Transform (FFT) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 复数（用对象 {re, im} 表达，避免引入第三方库）。 */
export interface Complex {
  re: number;
  im: number;
}

/** 复数四则运算（纯函数，返回新对象）。 */
export const cx = {
  add: (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im }),
  sub: (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im }),
  mul: (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }),
  fromReal: (x: number): Complex => ({ re: x, im: 0 }),
};

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FftHooks {
  /** 进入某一蝶形级 stage（0-based），该级含 half 个蝶形单元。 */
  onStage?: (stage: number, half: number) => void;
  /** 一次蝶形运算：合并偶/奇两半，主元 w 为当前旋转因子。 */
  onButterfly?: (stage: number, k: number, w: Complex) => void;
  /** 单个旋转因子 w 计算/使用。 */
  onTwiddle?: (stage: number, w: Complex) => void;
  /** 变换完成。 */
  onDone?: (result: Complex[], inverse: boolean) => void;
}

/** 判断是否为 2 的幂。 */
export function isPow2(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/** 位反转（bit-reversal）：对 len=log2(n) 位二进制逆序。 */
export function bitReverse(x: number, len: number): number {
  let r = 0;
  for (let i = 0; i < len; i++) {
    r = (r << 1) | (x & 1);
    x >>= 1;
  }
  return r;
}

/**
 * **迭代版 Cooley–Tukey FFT**（基-2，位反转重排 + 蝶形运算）。
 *
 * 输入 `a` 长度必须为 2 的幂。`inverse=false`（默认）做正向 DFT，
 * `inverse=true` 做 IDFT（结果再除以 n）。
 *
 * 原地修改 `a` 并返回之。
 *
 * 蝶形结构：对每个 stage（半步长 half=2^stage）：
 *   - 旋转因子 `w_n^k = exp(−2πi·k / (2·half))`（正向取负角，逆向取正角）
 *   - 对 `i = base, base+1, …` 中的每对 `(i, i+half)`：
 *       t = w · a[i+half];  a[i+half] = a[i] − t;  a[i] = a[i] + t
 *
 * 时间 `O(n log n)`，空间 `O(n)` 原地。
 */
export function fftInPlace(a: Complex[], inverse = false, hooks: FftHooks = {}): Complex[] {
  const n = a.length;
  if (n === 0) return a;
  if (!isPow2(n)) throw new RangeError('fft: input length must be a power of 2');

  const sign = inverse ? 1 : -1; // 正向 −，逆向 +

  // 1) 位反转重排
  const len = Math.log2(n);
  for (let i = 0; i < n; i++) {
    const j = bitReverse(i, len);
    if (j > i) {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
    }
  }

  // 2) 蝶形运算：stage 从 0（half=1）到 log2(n)−1
  for (let half = 1; half < n; half <<= 1) {
    const stage = Math.log2(half);
    hooks.onStage?.(stage, half);
    // w_n = exp(sign · π i / half)：本级的「主旋转因子」
    const ang = (sign * Math.PI) / half;
    const wStep: Complex = { re: Math.cos(ang), im: Math.sin(ang) };
    hooks.onTwiddle?.(stage, wStep);
    for (let base = 0; base < n; base += 2 * half) {
      let w: Complex = { re: 1, im: 0 };
      for (let k = 0; k < half; k++) {
        const i = base + k;
        const j = base + k + half;
        const t = cx.mul(w, a[j]!);
        a[j] = cx.sub(a[i]!, t);
        a[i] = cx.add(a[i]!, t);
        hooks.onButterfly?.(stage, k, w);
        w = cx.mul(w, wStep);
      }
    }
  }

  // 3) 逆向再除以 n
  if (inverse) {
    for (let i = 0; i < n; i++) {
      a[i] = { re: a[i]!.re / n, im: a[i]!.im / n };
    }
  }

  hooks.onDone?.(a, inverse);
  return a;
}

/**
 * 便捷：对实数数组做正向 FFT（自动零填充到最近的 2 的幂）。
 * @param reals 实数序列（长度会被向上补 0 到 2 的幂）
 * @returns 复数频谱（长度 = 补齐后的 2 的幂）
 */
export function fft(reals: number[], inverse = false, hooks: FftHooks = {}): Complex[] {
  if (reals.length === 0) return [];
  // 补 0 到 2 的幂
  let n = 1;
  while (n < reals.length) n <<= 1;
  const a: Complex[] = new Array<Complex>(n);
  for (let i = 0; i < n; i++) a[i] = cx.fromReal(reals[i] ?? 0);
  return fftInPlace(a, inverse, hooks);
}

/**
 * 朴素 DFT（`O(n²)`），用于交叉校验 FFT 正确性。
 * `inverse=true` 做 IDFT（除以 n）。
 */
export function dftNaive(reals: number[], inverse = false): Complex[] {
  const n = reals.length;
  const out: Complex[] = new Array<Complex>(n);
  const sign = inverse ? 1 : -1;
  for (let k = 0; k < n; k++) {
    let re = 0;
    let im = 0;
    for (let t = 0; t < n; t++) {
      const ang = (sign * 2 * Math.PI * k * t) / n;
      re += reals[t]! * Math.cos(ang);
      im += reals[t]! * Math.sin(ang);
    }
    if (inverse) {
      out[k] = { re: re / n, im: im / n };
    } else {
      out[k] = { re, im };
    }
  }
  return out;
}
