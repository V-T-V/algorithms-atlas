// Nesterov Accelerated Gradient · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-momentum-nesterov',
  categoryId: 'optimization',
  title: { zh: 'Nesterov 加速梯度', en: 'Nesterov Accelerated Gradient' },
  summary: {
    zh: '前瞻计算梯度，使动量更新更精准收敛更快。',
    en: 'Look-ahead gradient evaluation for sharper momentum convergence.',
  },
  description: {
    zh: '先按动量前瞻一步，在预计的新位置计算梯度，再更新，比普通动量更早纠正方向。',
    en: 'Take a look-ahead step along momentum, compute the gradient there, then update.',
  },
  tags: ['optimization', 'momentum', 'first-order'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
