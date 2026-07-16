// FFT（Bluestein / Chirp Z）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-fft-bluestein',
  categoryId: 'numerical',
  title: { zh: 'FFT（Bluestein 算法）', en: 'FFT (Bluestein Algorithm)' },
  summary: {
    zh: 'Bluestein/Chirp Z 算法把任意长度 DFT 转化为卷积，用基-2 FFT 求解。',
    en: 'Bluestein/chirp-z algorithm reduces an arbitrary-length DFT to a convolution, solved via radix-2 FFT.',
  },
  description: {
    zh: 'Bluestein 算法（又称 chirp Z 变换）：对任意长度 N 的 DFT，令 X[k] = Σ_{n=0}^{N-1} x[n] ω^{kn}, ω = e^{-2πi/N}。\n利用恒等式 kn = (k² + n² - (k-n)²)/2，把求和改写为 X[k] = ω^{k²/2} · Σ_n [x[n] ω^{n²/2}] · ω^{-(k-n)²/2}。\n即 X[k] = b[k] · (a * c)[k]，其中 a[n] = x[n]·ω^{n²/2}，b[k] = ω^{k²/2}，c[n] = ω^{-n²/2}。\n\n用长度 ≥ 2N-1（取下一个 2 的幂）的 FFT 计算线性卷积。复杂度 O(N log N)。',
    en: 'Bluestein algorithm (chirp-z transform): for arbitrary length N, rewrite X[k]=Σ x[n]ω^{kn} as a convolution using kn=(k²+n²-(k-n)²)/2. Then X[k]=b[k]·(a*c)[k] with a[n]=x[n]ω^{n²/2}, b[k]=ω^{k²/2}, c[n]=ω^{-n²/2}. Compute the linear convolution via FFT of length ≥2N-1 (next power of 2). Complexity O(N log N).',
  },
  tags: ['numerical', 'fft', 'dft', 'bluestein', 'chirp-z'],
  complexity: { time: 'O(N log N)', space: 'O(N)' },
};
