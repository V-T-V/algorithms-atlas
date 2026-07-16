// 批量梯度下降（Batch Gradient Descent）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-gradient-batch-3',
  categoryId: 'optimization',
  title: { zh: '批量梯度下降', en: 'Batch Gradient Descent' },
  summary: {
    zh: '每步用全部样本平均梯度更新，稳定但慢于随机法。',
    en: 'Update with the average gradient over all samples; stable but slower than stochastic.',
  },
  description: {
    zh: '批量梯度下降：θ←θ-η·∇L(θ)，L 为全部样本平均损失。凸函数收敛到最优。',
    en: 'Batch GD: θ<-θ-η·∇L(θ), L averaged over all samples. Converges for convex L.',
  },
  tags: ['optimization', 'gradient-descent', 'machine-learning'],
  complexity: { time: 'O(k·n·d)', space: 'O(d)' },
};
