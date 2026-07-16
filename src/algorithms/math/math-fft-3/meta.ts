import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-fft-3',
  categoryId: 'math',
  title: { zh: 'FFT（复数迭代实现）', en: 'FFT (Iterative, Complex)' },
  summary: {
    zh: '用单位根做 Cooley-Tukey 迭代 FFT 实现多项式乘法。',
    en: 'Iterative Cooley-Tukey FFT using complex roots of unity for polynomial multiplication.',
  },
  description: {
    zh: '位逆序重排后按蝶形长度 2,4,8,... 合并。复数 ω=e^(2πi/n)。乘法 = 两次 FFT 一次点积一次逆 FFT。',
    en: 'Bit-reverse then butterfly with lengths 2,4,8,.... ω=e^(2πi/n). Multiply = two FFTs, pointwise product, inverse FFT.',
  },
  tags: ['math', 'fft', 'polynomial'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
