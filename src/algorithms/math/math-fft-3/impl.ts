// =============================================================================
// FFT (迭代，复数)
// =============================================================================

interface Complex {
  re: number;
  im: number;
}

function cAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}
function cSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}
function cMul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

export interface FftHooks {
  onButterfly?: (stage: number) => void;
  onDone?: (result: number[]) => void;
}

function bitReverse(x: number, bits: number): number {
  let r = 0;
  for (let i = 0; i < bits; i++) if ((x >> i) & 1) r |= 1 << (bits - 1 - i);
  return r;
}

function fft(a: Complex[], invert: boolean, hooks: FftHooks = {}): void {
  const n = a.length;
  const bits = Math.log2(n);
  for (let i = 0; i < n; i++) {
    const j = bitReverse(i, bits);
    if (i < j) {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
    }
  }
  for (let len = 2, stage = 0; len <= n; len <<= 1, stage++) {
    const ang = ((2 * Math.PI) / len) * (invert ? -1 : 1);
    const wn: Complex = { re: Math.cos(ang), im: Math.sin(ang) };
    for (let i = 0; i < n; i += len) {
      let w: Complex = { re: 1, im: 0 };
      for (let j = 0; j < len / 2; j++) {
        const u = a[i + j]!;
        const v = cMul(a[i + j + len / 2]!, w);
        a[i + j] = cAdd(u, v);
        a[i + j + len / 2] = cSub(u, v);
        w = cMul(w, wn);
      }
      hooks.onButterfly?.(stage);
    }
  }
  if (invert)
    for (let i = 0; i < n; i++) {
      a[i] = { re: a[i]!.re / n, im: a[i]!.im / n };
    }
}

export function multiplyFFT(
  a: readonly number[],
  b: readonly number[],
  hooks: FftHooks = {},
): number[] {
  let size = 1;
  while (size < a.length + b.length) size <<= 1;
  const fa: Complex[] = Array.from({ length: size }, () => ({ re: 0, im: 0 }));
  const fb: Complex[] = Array.from({ length: size }, () => ({ re: 0, im: 0 }));
  for (let i = 0; i < a.length; i++) fa[i]!.re = a[i]!;
  for (let i = 0; i < b.length; i++) fb[i]!.re = b[i]!;
  fft(fa, false, hooks);
  fft(fb, false, hooks);
  for (let i = 0; i < size; i++) fa[i] = cMul(fa[i]!, fb[i]!);
  fft(fa, true, hooks);
  const result = fa.slice(0, a.length + b.length - 1).map((c) => Math.round(c.re));
  hooks.onDone?.(result);
  return result;
}
