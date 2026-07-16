// Matrix Chain Multiply · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'matrix-chain',
  categoryId: 'dp',
  title: { zh: '矩阵连乘', en: 'Matrix Chain Multiply' },
  summary: {
    zh: '矩阵连乘属于dp类别。',
    en: 'Matrix Chain Multiply is a dp algorithm.',
  },
  description: {
    zh: '矩阵连乘（Matrix Chain Multiply）属于dp类别的算法。',
    en: 'Matrix Chain Multiply is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
