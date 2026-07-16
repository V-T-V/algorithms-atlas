// Mini-Batch Gradient Descent · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-gradient-mini-batch',
  categoryId: 'optimization',
  title: { zh: '小批量梯度下降', en: 'Mini-Batch Gradient Descent' },
  summary: {
    zh: '每次用一小批样本估计梯度更新参数。',
    en: 'Update parameters using gradients estimated from a small batch of samples.',
  },
  description: {
    zh: '把样本分为若干小批量，每批计算平均梯度更新一次，兼顾速度与稳定性。',
    en: 'Split samples into mini-batches, updating once per batch averaging batch gradients.',
  },
  tags: ['optimization', 'gradient-descent', 'stochastic', 'first-order'],
  complexity: { time: 'O(k·b·d)', space: 'O(d)' },
};
