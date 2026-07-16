// PCA · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pca',
  categoryId: 'ml',
  title: { zh: '主成分分析', en: 'PCA' },
  summary: {
    zh: '主成分分析属于ml类别。',
    en: 'PCA is a ml algorithm.',
  },
  description: {
    zh: '主成分分析（PCA）属于ml类别的算法。',
    en: 'PCA is an algorithm in the ml category.',
  },
  tags: ["ml","machine-learning"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
