// Batch Gradient Descent · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-gradient-batch',
  categoryId: 'optimization',
  title: { zh: '批量梯度下降', en: 'Batch Gradient Descent' },
  summary: {
    zh: '每步使用全部样本梯度的精确下降。',
    en: 'Exact descent using the full-sample gradient at every step.',
  },
  description: {
    zh: '批量梯度下降每步计算完整数据集上的真实梯度，方向最稳但开销最大。',
    en: 'Batch GD computes the true full-dataset gradient each step; stable but expensive.',
  },
  tags: ['optimization', 'gradient-descent', 'first-order'],
  complexity: { time: 'O(k·n·d)', space: 'O(d)' },
};
