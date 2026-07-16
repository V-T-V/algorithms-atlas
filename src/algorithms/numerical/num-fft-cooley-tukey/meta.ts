// FFT（Cooley-Tukey）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'num-fft-cooley-tukey',
  categoryId: 'numerical',
  title: { zh: 'FFT（Cooley-Tukey）', en: 'FFT (Cooley-Tukey)' },
  summary: {
    zh: '基-2 快速傅里叶变换，O(n log n) 计算 DFT（要求长度为 2 的幂）。',
    en: 'Radix-2 Fast Fourier Transform computing the DFT in O(n log n) (length must be a power of 2).',
  },
  description: {
    zh: 'Cooley-Tukey FFT 把长度 N=2^k 的 DFT 分解为两个长度 N/2 的子 DFT（偶数项与奇数项）：\n```\nX[k] = E[k] + ω^k · O[k]\nX[k + N/2] = E[k] - ω^k · O[k]\n```\n其中 ω = e^{-2πi/N}。\n\n递归 / 迭代实现（蝶形运算）。对长度非 2 的幂的输入，补零到下一个 2 的幂。\n\n复杂度 O(N log N)，远快于朴素 DFT 的 O(N²)。',
    en: 'Cooley-Tukey FFT splits a length-N=2^k DFT into two length-N/2 sub-DFTs (even and odd): X[k]=E[k]+ω^k O[k], X[k+N/2]=E[k]-ω^k O[k], with ω=e^{-2πi/N}. Implemented iteratively (butterflies). Inputs not a power of 2 are zero-padded to the next power. Complexity O(N log N), much faster than naive O(N²).',
  },
  tags: ['numerical', 'fft', 'dft', 'cooley-tukey', 'divide-and-conquer'],
  complexity: { time: 'O(N log N)', space: 'O(N)' },
};
