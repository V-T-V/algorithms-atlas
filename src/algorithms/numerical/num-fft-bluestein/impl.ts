// =============================================================================
// FFT（Bluestein / Chirp Z）· 纯算法实现
//   任意长度 DFT，通过卷积 + 基-2 FFT
// =============================================================================

import { fft, cAdd, cSub, cMul, type Complex } from '../num-fft-cooley-tukey/impl.ts';

export type { Complex };

/** 任意长度 DFT（Bluestein）。 */
export function bluesteinDFT(input: Complex[], inverse = false): Complex[] {
  const N = input.length;
  if (N === 0) return [];
  if (N === 1) return [{ re: input[0]!.re, im: input[0]!.im }];

  const sign = inverse ? 1 : -1;
  // ω = exp(sign · i · 2π / N)
  // chirp 因子 w_n = exp(sign · i · π n² / N)
  const chirp = (n: number): Complex => {
    const ang = (sign * Math.PI * n * n) / N;
    return { re: Math.cos(ang), im: Math.sin(ang) };
  };

  // a[n] = x[n] · chirp(n)
  const a: Complex[] = [];
  for (let n = 0; n < N; n++) a.push(cMul(input[n]!, chirp(n)));

  // c[m] = conj(chirp(m))，长度 = 2N-1（m = -(N-1) .. N-1）
  // 但 chirp 关于 N 的周期性：chirp(-m) = chirp(m)（因为 (-m)² = m²）
  // 所以 c[m] = 1/chirp(m) = conj(chirp(m))
  // 我们构造长度 L ≥ 2N-1 的序列（取下一个 2 的幂）
  let L = 1;
  while (L < 2 * N - 1) L <<= 1;

  // 扩展 a 到长度 L（补零）
  const aExt: Complex[] = [];
  for (let i = 0; i < L; i++) aExt.push(i < N ? a[i]! : { re: 0, im: 0 });

  // 构造 c 序列（长度 L）：索引 0..N-1 对应 m=0..N-1；索引 L-(N-1)..L-1 对应 m=-(N-1)..-1
  const cExt: Complex[] = [];
  for (let i = 0; i < L; i++) cExt.push({ re: 0, im: 0 });
  for (let m = 0; m < N; m++) {
    cExt[m] = { re: chirp(m).re, im: -chirp(m).im }; // 共轭
  }
  for (let m = 1; m < N; m++) {
    cExt[L - m] = { re: chirp(m).re, im: -chirp(m).im };
  }

  // 频域相乘
  const A = fft(aExt);
  const C = fft(cExt);
  const AC: Complex[] = [];
  for (let i = 0; i < L; i++) AC.push(cMul(A[i]!, C[i]!));
  const conv = fft(AC, true);

  // 取前 N 个并乘 b[k] = chirp(k)
  const X: Complex[] = [];
  for (let k = 0; k < N; k++) {
    X.push(cMul(chirp(k), conv[k]!));
  }

  if (inverse) {
    for (let i = 0; i < N; i++) {
      X[i]!.re /= N;
      X[i]!.im /= N;
    }
  }
  return X;
}

void cAdd;
void cSub;
