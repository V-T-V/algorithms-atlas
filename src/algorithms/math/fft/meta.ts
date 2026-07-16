// Fast Fourier Transform · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fft',
  categoryId: 'math',
  title: { zh: '快速傅里叶变换', en: 'Fast Fourier Transform' },
  summary: {
    zh: '快速傅里叶变换属于math类别。',
    en: 'Fast Fourier Transform is a math algorithm.',
  },
  description: {
    zh: '快速傅里叶变换（Fast Fourier Transform）属于math类别的算法。',
    en: 'Fast Fourier Transform is an algorithm in the math category.',
  },
  tags: ["math","polynomial"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
