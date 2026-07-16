// Gaussian Mix · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gaussian',
  categoryId: 'ml',
  title: { zh: '高斯混合', en: 'Gaussian Mix' },
  summary: {
    zh: '高斯混合属于ml类别。',
    en: 'Gaussian Mix is a ml algorithm.',
  },
  description: {
    zh: '高斯混合（Gaussian Mix）属于ml类别的算法。',
    en: 'Gaussian Mix is an algorithm in the ml category.',
  },
  tags: ["ml","numerical-method"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
